"""
GEDCOM data merger.

This module provides functions for merging data from multiple GEDCOM files.
Handles overlapping individuals and families by combining their data.
"""

from typing import Dict, List, Tuple
from utils.logger import get_logger

logger = get_logger(__name__)


def merge_individuals(individuals1: Dict, individuals2: Dict, source1_name: str = "Tree 1", source2_name: str = "Tree 2") -> Dict:
    """
    Merge two individuals dictionaries.
    
    If the same INDI ID exists in both, merges the data:
    - Combines FAMS lists (union, no duplicates)
    - Keeps FAMC if one exists (or both are the same)
    - Merges BIRT and DEAT data (prefers non-empty values)
    - Checks for consistency in NAME, birth/death dates
    
    Args:
        individuals1: First individuals dictionary
        individuals2: Second individuals dictionary
        source1_name: Name of first source (for logging)
        source2_name: Name of second source (for logging)
    
    Returns:
        Merged individuals dictionary
    
    Example:
        >>> ind1 = {"@I123@": {"NAME": "John Doe", "FAMS": ["@F1@"]}}
        >>> ind2 = {"@I123@": {"NAME": "John Doe", "FAMS": ["@F2@"]}}
        >>> merged = merge_individuals(ind1, ind2)
        >>> len(merged["@I123@"]["FAMS"])
        2
    """
    logger.info(f"Merging individuals from {source1_name} and {source2_name}...")
    
    merged = individuals1.copy()
    conflicts = []
    
    for indi_id, indi2_data in individuals2.items():
        if indi_id in merged:
            # Person exists in both - merge the data
            indi1_data = merged[indi_id]
            conflicts.extend(_check_individual_consistency(indi_id, indi1_data, indi2_data, source1_name, source2_name))
            merged[indi_id] = _merge_individual_data(indi1_data, indi2_data, source1_name, source2_name)
            logger.debug(f"Merged individual {indi_id}: {merged[indi_id].get('NAME', 'Unknown')}")
        else:
            # New person - just add it
            merged[indi_id] = indi2_data
            logger.debug(f"Added new individual {indi_id}: {indi2_data.get('NAME', 'Unknown')}")
    
    if conflicts:
        logger.warning(f"Found {len(conflicts)} potential conflicts during merge:")
        for conflict in conflicts:
            logger.warning(f"  {conflict}")
    else:
        logger.info("No conflicts found - all overlapping individuals are consistent")
    
    logger.info(f"Merged result: {len(merged)} individuals (was {len(individuals1)} + {len(individuals2)})")
    return merged


def _merge_individual_data(indi1: Dict, indi2: Dict, source1_name: str = "Tree 1", source2_name: str = "Tree 2") -> Dict:
    """
    Merge data from two individual records with the same ID.
    
    Strategy:
    - NAME: Must match (checked separately)
    - FAMS: Union of both lists
    - FAMC: Keep if exists, prefer non-empty
    - BIRT/DEAT: Merge nested dicts, prefer non-empty values
    - _PRIVATE: OR logic - if either is private, result is private
    - Other fields: Prefer non-empty values
    
    Args:
        indi1: First individual record
        indi2: Second individual record
        source1_name: Name of first source (for logging)
        source2_name: Name of second source (for logging)
    """
    merged = indi1.copy()
    
    # Merge FAMS lists (union, no duplicates)
    fams1 = indi1.get("FAMS", [])
    fams2 = indi2.get("FAMS", [])
    if not isinstance(fams1, list):
        fams1 = [fams1] if fams1 else []
    if not isinstance(fams2, list):
        fams2 = [fams2] if fams2 else []
    merged["FAMS"] = list(set(fams1 + fams2))
    
    # Merge FAMC (family as child)
    famc1 = indi1.get("FAMC", "")
    famc2 = indi2.get("FAMC", "")
    if famc1 and famc2:
        if famc1 != famc2:
            logger.warning(f"  Different FAMC values: '{famc1}' vs '{famc2}' - keeping first")
        merged["FAMC"] = famc1
    elif famc2:
        merged["FAMC"] = famc2
    
    # Merge BIRT (birth)
    birt1 = indi1.get("BIRT", {})
    birt2 = indi2.get("BIRT", {})
    if isinstance(birt1, dict) and isinstance(birt2, dict):
        merged["BIRT"] = {**birt1, **birt2}  # birt2 values override birt1
    elif birt2:
        merged["BIRT"] = birt2
    
    # Merge DEAT (death)
    deat1 = indi1.get("DEAT", {})
    deat2 = indi2.get("DEAT", {})
    if isinstance(deat1, dict) and isinstance(deat2, dict):
        merged["DEAT"] = {**deat1, **deat2}
    elif deat2:
        merged["DEAT"] = deat2
    
    # Merge _PRIVATE tag (OR logic - if either is private, result is private)
    private1 = _is_private_tag(indi1)
    private2 = _is_private_tag(indi2)
    if private1 or private2:
        # If either tree marks as private, keep it private
        # Use the value from the one that has it, or "Y" if both
        if private1 and private2:
            # Both are private - keep the first one's value
            merged["_PRIVATE"] = indi1.get("_PRIVATE", "Y")
        elif private1:
            merged["_PRIVATE"] = indi1.get("_PRIVATE", "Y")
        else:
            merged["_PRIVATE"] = indi2.get("_PRIVATE", "Y")
        if private1 != private2:
            status1 = "private" if private1 else "not private"
            status2 = "private" if private2 else "not private"
            logger.debug(f"  _PRIVATE status differs: {source1_name} ({status1}) vs {source2_name} ({status2}) - keeping private")
    elif "_PRIVATE" in merged:
        # Neither is private, but first had the tag - remove it
        del merged["_PRIVATE"]
    
    # Merge other fields
    # Strategy depends on field type:
    # - OCCU, NOTE, RESI: Prefer non-empty, warn if different
    # - Custom tags (_*): Merge with OR logic (like _PRIVATE)
    # - Other fields: Prefer non-empty, warn if different
    for key, value2 in indi2.items():
        if key in ("FAMS", "FAMC", "BIRT", "DEAT", "_PRIVATE"):
            continue  # Already handled above
        
        value1 = merged.get(key, "")
        
        # Handle custom tags (starting with _) - use OR logic
        if key.startswith("_"):
            # For custom tags, if either has it, keep it
            if value1 or value2:
                # Prefer non-empty, or first if both exist
                if value1 and value2 and value1 != value2:
                    logger.debug(f"  Custom tag {key} differs: '{value1}' vs '{value2}' - keeping first")
                    merged[key] = value1
                elif value2:
                    merged[key] = value2
        # Handle text fields (OCCU, NOTE, RESI, etc.)
        elif not value1 and value2:
            # First doesn't have it, second does - use second
            merged[key] = value2
        elif value1 and value2 and value1 != value2:
            # Both have different values - keep first, but warn
            logger.warning(f"  Field {key} differs: '{value1}' ({source1_name}) vs '{value2}' ({source2_name}) - keeping first")
            merged[key] = value1
        # If both are same or first has it and second doesn't, keep first (already in merged)
    
    return merged


def _is_private_tag(indi: Dict) -> bool:
    """
    Check if an individual record has _PRIVATE tag set to true.
    
    Args:
        indi: Individual record dictionary
    
    Returns:
        True if _PRIVATE tag exists and is set to Y/YES/1/TRUE (case-insensitive)
    """
    if "_PRIVATE" not in indi:
        return False
    value = str(indi["_PRIVATE"]).upper().strip()
    return value in ("Y", "YES", "1", "TRUE")


def _check_individual_consistency(indi_id: str, indi1: Dict, indi2: Dict, source1: str, source2: str) -> List[str]:
    """
    Check for consistency issues between two individual records.
    
    Returns list of conflict messages (empty if no conflicts).
    """
    conflicts = []
    
    # Check NAME
    name1 = indi1.get("NAME", "").strip()
    name2 = indi2.get("NAME", "").strip()
    if name1 and name2 and name1 != name2:
        conflicts.append(f"{indi_id}: Different names - '{name1}' ({source1}) vs '{name2}' ({source2})")
    
    # Check birth date
    birt1 = indi1.get("BIRT", {})
    birt2 = indi2.get("BIRT", {})
    if isinstance(birt1, dict) and isinstance(birt2, dict):
        date1 = birt1.get("DATE", "").strip()
        date2 = birt2.get("DATE", "").strip()
        if date1 and date2 and date1 != date2:
            conflicts.append(f"{indi_id}: Different birth dates - '{date1}' ({source1}) vs '{date2}' ({source2})")
    
    # Check death date
    deat1 = indi1.get("DEAT", {})
    deat2 = indi2.get("DEAT", {})
    if isinstance(deat1, dict) and isinstance(deat2, dict):
        date1 = deat1.get("DATE", "").strip()
        date2 = deat2.get("DATE", "").strip()
        if date1 and date2 and date1 != date2:
            conflicts.append(f"{indi_id}: Different death dates - '{date1}' ({source1}) vs '{date2}' ({source2})")
    
    # Check _PRIVATE status (informational, not a conflict - we use OR logic)
    private1 = _is_private_tag(indi1)
    private2 = _is_private_tag(indi2)
    if private1 != private2:
        logger.debug(f"{indi_id}: _PRIVATE status differs - {source1}: {'private' if private1 else 'not private'}, {source2}: {'private' if private2 else 'not private'} (will keep private if either is private)")
    
    return conflicts


def merge_families(families1: Dict, families2: Dict, source1_name: str = "Tree 1", source2_name: str = "Tree 2") -> Dict:
    """
    Merge two families dictionaries.
    
    If the same FAM ID exists in both, merges the data:
    - Combines CHIL lists (union, no duplicates)
    - Keeps HUSB/WIFE if they match or one is empty
    - Checks for consistency
    
    Args:
        families1: First families dictionary
        families2: Second families dictionary
        source1_name: Name of first source (for logging)
        source2_name: Name of second source (for logging)
    
    Returns:
        Merged families dictionary
    """
    logger.info(f"Merging families from {source1_name} and {source2_name}...")
    
    merged = families1.copy()
    conflicts = []
    
    for fam_id, fam2_data in families2.items():
        if fam_id in merged:
            # Family exists in both - merge the data
            fam1_data = merged[fam_id]
            conflicts.extend(_check_family_consistency(fam_id, fam1_data, fam2_data, source1_name, source2_name))
            merged[fam_id] = _merge_family_data(fam1_data, fam2_data)
            logger.debug(f"Merged family {fam_id}")
        else:
            # New family - just add it
            merged[fam_id] = fam2_data
            logger.debug(f"Added new family {fam_id}")
    
    if conflicts:
        logger.warning(f"Found {len(conflicts)} potential conflicts during family merge:")
        for conflict in conflicts:
            logger.warning(f"  {conflict}")
    else:
        logger.info("No conflicts found - all overlapping families are consistent")
    
    logger.info(f"Merged result: {len(merged)} families (was {len(families1)} + {len(families2)})")
    return merged


def _merge_family_data(fam1: Dict, fam2: Dict) -> Dict:
    """
    Merge data from two family records with the same ID.
    
    Strategy:
    - CHIL: Union of both lists
    - HUSB/WIFE: Keep if matches or one is empty
    - Other fields: Prefer non-empty
    """
    merged = fam1.copy()
    
    # Merge CHIL lists (union, no duplicates)
    chil1 = fam1.get("CHIL", [])
    chil2 = fam2.get("CHIL", [])
    if not isinstance(chil1, list):
        chil1 = [chil1] if chil1 else []
    if not isinstance(chil2, list):
        chil2 = [chil2] if chil2 else []
    merged["CHIL"] = list(set(chil1 + chil2))
    
    # Merge HUSB (husband)
    husb1 = fam1.get("HUSB", "")
    husb2 = fam2.get("HUSB", "")
    if husb1 and husb2:
        if husb1 != husb2:
            logger.warning(f"  Different HUSB values: '{husb1}' vs '{husb2}' - keeping first")
        merged["HUSB"] = husb1
    elif husb2:
        merged["HUSB"] = husb2
    
    # Merge WIFE (wife)
    wife1 = fam1.get("WIFE", "")
    wife2 = fam2.get("WIFE", "")
    if wife1 and wife2:
        if wife1 != wife2:
            logger.warning(f"  Different WIFE values: '{wife1}' vs '{wife2}' - keeping first")
        merged["WIFE"] = wife1
    elif wife2:
        merged["WIFE"] = wife2
    
    # Merge other fields
    for key, value2 in fam2.items():
        if key not in ("CHIL", "HUSB", "WIFE"):
            value1 = merged.get(key, "")
            if not value1 and value2:
                merged[key] = value2
    
    return merged


def _check_family_consistency(fam_id: str, fam1: Dict, fam2: Dict, source1: str, source2: str) -> List[str]:
    """
    Check for consistency issues between two family records.
    
    Returns list of conflict messages (empty if no conflicts).
    """
    conflicts = []
    
    # Check HUSB
    husb1 = fam1.get("HUSB", "").strip()
    husb2 = fam2.get("HUSB", "").strip()
    if husb1 and husb2 and husb1 != husb2:
        conflicts.append(f"{fam_id}: Different HUSB - '{husb1}' ({source1}) vs '{husb2}' ({source2})")
    
    # Check WIFE
    wife1 = fam1.get("WIFE", "").strip()
    wife2 = fam2.get("WIFE", "").strip()
    if wife1 and wife2 and wife1 != wife2:
        conflicts.append(f"{fam_id}: Different WIFE - '{wife1}' ({source1}) vs '{wife2}' ({source2})")
    
    return conflicts


def merge_gedcom_files(file_paths: List[str], source_names: List[str] = None) -> Tuple[Dict, Dict]:
    """
    Parse and merge multiple GEDCOM files.
    
    Args:
        file_paths: List of paths to .ged files
        source_names: Optional list of names for each source (for logging)
    
    Returns:
        Tuple of (merged_individuals, merged_families)
    
    Example:
        >>> individuals, families = merge_gedcom_files(
        ...     ["data/tree1.ged", "data/tree2.ged"],
        ...     ["Main Tree", "Extended Tree"]
        ... )
    """
    if not file_paths:
        raise ValueError("At least one GEDCOM file path is required")
    
    if source_names is None:
        source_names = [f"Tree {i+1}" for i in range(len(file_paths))]
    
    if len(source_names) != len(file_paths):
        raise ValueError("source_names must have same length as file_paths")
    
    from gedcom.parser import parse_gedcom_file
    
    logger.info(f"Merging {len(file_paths)} GEDCOM files...")
    
    # Parse first file
    individuals, families = parse_gedcom_file(file_paths[0])
    logger.info(f"Loaded {source_names[0]}: {len(individuals)} individuals, {len(families)} families")
    
    # Merge remaining files
    for i, file_path in enumerate(file_paths[1:], 1):
        indi2, fam2 = parse_gedcom_file(file_path)
        logger.info(f"Loaded {source_names[i]}: {len(indi2)} individuals, {len(fam2)} families")
        
        individuals = merge_individuals(individuals, indi2, "Merged", source_names[i])
        families = merge_families(families, fam2, "Merged", source_names[i])
    
    logger.info(f"Final merged result: {len(individuals)} individuals, {len(families)} families")
    return individuals, families

