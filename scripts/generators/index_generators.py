"""
Index generators for creating navigation and summary pages.

This module provides functions for creating various index pages:
- All profiles index
- Profiles with biographies
- Profiles with galleries
- Family data JSON
- Source content copying
- Project cleaning
"""

import os
import json
import urllib.parse
from typing import Dict
from gedcom.normalizer import norm_individual, norm_family
from utils.logger import get_logger
from utils.file_utils import copy_file_safe, copy_directory_safe, remove_directory_safe
from config import DEFAULT_OUTPUT_DIR, DEFAULT_STATIC_DIR

logger = get_logger(__name__)


def write_people_index(people_dir: str, pages_dir: str, individuals: Dict = None):
    """
    Create all-profiles.md with links to all profiles.
    Excludes private profiles if individuals dictionary is provided.
    
    Args:
        people_dir: Directory containing profile markdown files
        pages_dir: Directory to write index page to
        individuals: Optional dictionary of individuals from GEDCOM
                     (used to filter out private profiles)
    
    Example:
        >>> write_people_index("site/content/profiles", "site/content/pages")
        >>> write_people_index("site/content/profiles", "site/content/pages", individuals)
    """
    logger.info("Creating all-profiles index")
    
    files = sorted(
        f for f in os.listdir(people_dir)
        if f.lower().endswith(".md") and f.lower() not in ("index.md", "bios.md")
    )
    
    lines = ["## All Profiles\n"]
    profile_count = 0
    for fname in files:
        # Check if profile is private (if individuals dict is provided)
        if individuals:
            profile_path = os.path.join(people_dir, fname)
            gedcom_id = _extract_gedcom_id(profile_path)
            if gedcom_id:
                # Try to find the individual in the dict (with @ symbols)
                # GEDCOM IDs in the dict might have @ symbols
                pid_with_at = f"@{gedcom_id}@"
                pid_without_at = gedcom_id
                
                person = None
                if pid_with_at in individuals:
                    person = individuals[pid_with_at]
                elif pid_without_at in individuals:
                    person = individuals[pid_without_at]
                
                if person and _is_private_tag(person):
                    continue  # Skip private profiles
        
        # Use slugified name (with dashes) for URL
        slugified_name = fname[:-3]  # strip .md
        # Display name with spaces instead of dashes (same as profiles-of-interest)
        display_name = slugified_name.replace('-', ' ')
        url = "/profiles/" + urllib.parse.quote(slugified_name)
        lines.append(f"* [{display_name}]({url})")
        profile_count += 1
    
    os.makedirs(pages_dir, exist_ok=True)
    output_path = os.path.join(pages_dir, "all-profiles.md")
    
    try:
        with open(output_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines) + "\n")
        logger.info(f"Created all-profiles.md with {profile_count} profiles")
    except Exception as e:
        logger.error(f"Failed to write all-profiles.md: {e}")


def write_bios_index(people_dir: str, bios_dir: str, pages_dir: str):
    """
    Create profiles-of-interest.md with links to profiles that have biographies.
    
    Args:
        people_dir: Directory containing profile markdown files
        bios_dir: Directory containing biography files
        pages_dir: Directory to write index page to
    
    Example:
        >>> write_bios_index("site/content/profiles", "bios", "site/content/pages")
    """
    logger.info("Creating profiles-of-interest index")
    
    # Get all biography IDs
    bio_ids = _collect_bio_ids(bios_dir)
    logger.info(f"Found {len(bio_ids)} profiles with biographies")
    
    # Get all profile files that have matching bios
    profiles_with_bios = []
    for fname in sorted(os.listdir(people_dir)):
        if not fname.endswith('.md'):
            continue
        
        profile_path = os.path.join(people_dir, fname)
        gedcom_id = _extract_gedcom_id(profile_path)
        
        if gedcom_id and gedcom_id in bio_ids:
            # Use slugified name (with dashes instead of spaces) for URL
            slugified_name = fname[:-3].replace(' ', '-')
            # Display name with spaces instead of dashes
            display_name = fname[:-3].replace('-', ' ')
            profiles_with_bios.append((display_name, slugified_name))
    
    # Create the index page
    lines = [
        "## Profiles of Interest\n",
        "This page lists family members who have extended biographical information.\n"
    ]
    
    if profiles_with_bios:
        for title, slugified_name in profiles_with_bios:
            url = "/profiles/" + slugified_name
            lines.append(f"* [{title}]({url})")
    else:
        lines.append("*No biographical information available yet.*")
    
    os.makedirs(pages_dir, exist_ok=True)
    output_path = os.path.join(pages_dir, "profiles-of-interest.md")
    
    try:
        with open(output_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines) + "\n")
        logger.info(f"Created profiles-of-interest.md with {len(profiles_with_bios)} profiles")
    except Exception as e:
        logger.error(f"Failed to write profiles-of-interest.md: {e}")


def write_gallery_index(people_dir: str, static_dir: str, pages_dir: str):
    """
    Create profiles-with-gallery.md with links to profiles that have images.
    
    Args:
        people_dir: Directory containing profile markdown files
        static_dir: Directory containing media-index.json
        pages_dir: Directory to write index page to
    
    Example:
        >>> write_gallery_index("site/content/profiles", "site/quartz/static", "site/content/pages")
    """
    logger.info("Creating profiles-with-gallery index")
    
    # Read media-index.json
    media_index_path = os.path.join(static_dir, "media-index.json")
    
    if not os.path.exists(media_index_path):
        logger.warning("media-index.json not found, creating empty gallery index")
        _create_empty_gallery_index(pages_dir)
        return
    
    # Load media index
    try:
        with open(media_index_path, 'r', encoding='utf-8') as f:
            media_index = json.load(f)
    except Exception as e:
        logger.error(f"Failed to read media-index.json: {e}")
        _create_empty_gallery_index(pages_dir)
        return
    
    # Get all profile IDs that have images
    gallery_ids = set()
    if 'images' in media_index:
        gallery_ids = set(media_index['images'].keys())
    
    logger.info(f"Found {len(gallery_ids)} profiles with gallery images")
    
    # Get all profile files that have matching gallery
    profiles_with_gallery = []
    for fname in sorted(os.listdir(people_dir)):
        if not fname.endswith('.md'):
            continue
        
        profile_path = os.path.join(people_dir, fname)
        gedcom_id = _extract_gedcom_id(profile_path)
        
        if gedcom_id and gedcom_id in gallery_ids:
            # Use slugified name (with dashes instead of spaces) for URL
            slugified_name = fname[:-3].replace(' ', '-')
            # Display name with spaces instead of dashes
            display_name = fname[:-3].replace('-', ' ')
            profiles_with_gallery.append((display_name, slugified_name))
    
    # Create the index page
    lines = [
        "## Profiles with Gallery\n",
        "This page lists family members who have images in their gallery.\n"
    ]
    
    if profiles_with_gallery:
        for title, slugified_name in profiles_with_gallery:
            url = "/profiles/" + slugified_name
            lines.append(f"* [{title}]({url})")
    else:
        lines.append("*No gallery images available yet.*")
    
    os.makedirs(pages_dir, exist_ok=True)
    output_path = os.path.join(pages_dir, "profiles-with-gallery.md")
    
    try:
        with open(output_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines) + "\n")
        logger.info(f"Created profiles-with-gallery.md with {len(profiles_with_gallery)} profiles")
    except Exception as e:
        logger.error(f"Failed to write profiles-with-gallery.md: {e}")


def write_family_data_json(individuals: Dict, families: Dict, out_dir: str):
    """
    Generate family-data.json for the large family tree visualization.
    
    Args:
        individuals: Raw individuals from GEDCOM
        families: Raw families from GEDCOM
        out_dir: Output directory for profiles (used to find static dir)
    
    Example:
        >>> write_family_data_json(individuals, families, "site/content/profiles")
    """
    logger.info("Generating family-data.json")
    
    inds = {i: norm_individual(i, d) for i, d in individuals.items()}
    fams = {f: norm_family(f, d) for f, d in families.items()}
    
    # Build clean data structure
    people = []
    for pid, p in inds.items():
        clean_id = pid.strip("@")
        people.append({
            "id": clean_id,
            "name": p["name"],
            "birth_date": p["birth_date"],
            "death_date": p["death_date"],
            "famc": p["famc"].strip("@") if p["famc"] else None,
            "fams": [f.strip("@") for f in p["fams"]]
        })
    
    families_list = []
    for fid, f in fams.items():
        clean_id = fid.strip("@")
        families_list.append({
            "id": clean_id,
            "husband": f["husband"].strip("@") if f["husband"] else None,
            "wife": f["wife"].strip("@") if f["wife"] else None,
            "children": [c.strip("@") for c in f["children"]]
        })
    
    data = {
        "people": people,
        "families": families_list
    }
    
    # Write to Quartz static folder
    # Assuming output is site/content/profiles, static is at site/quartz/static
    static_dir = os.path.join(out_dir, "..", "..", "quartz", "static")
    os.makedirs(static_dir, exist_ok=True)
    output_path = os.path.join(static_dir, "family-data.json")
    
    try:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        logger.info(f"Generated family-data.json with {len(people)} people and {len(families_list)} families")
    except Exception as e:
        logger.error(f"Failed to write family-data.json: {e}")


def write_id_to_slug_json(id_to_slug: Dict, out_dir: str, static_dir: str = None):
    """
    Generate id-to-slug.json for JavaScript to convert [Name|ID] to slugs.
    
    Args:
        id_to_slug: Mapping from person ID (with @ symbols) to unique slug
        out_dir: Output directory for profiles (used to find static dir if static_dir not provided)
        static_dir: Optional static directory path (if provided, used directly)
    
    Example:
        >>> write_id_to_slug_json(id_to_slug, "site/content/profiles")
        >>> write_id_to_slug_json(id_to_slug, "site/content/profiles", "site/quartz/static")
    """
    logger.info("Generating id-to-slug.json")
    
    # Convert IDs from @I123@ format to I123 format for JavaScript
    clean_mapping = {}
    for pid, slug in id_to_slug.items():
        clean_id = pid.strip("@")
        clean_mapping[clean_id] = slug
    
    # Write to Quartz static folder
    if static_dir is None:
        # Calculate static dir relative to out_dir
        # Assuming output is site/content/profiles, static is at site/quartz/static
        static_dir = os.path.join(out_dir, "..", "..", "quartz", "static")
    
    # Normalize path to handle relative paths correctly
    # If static_dir is relative and starts with "site/", resolve it relative to project root
    if not os.path.isabs(static_dir):
        # Check if path starts with "site/" - if so, find project root
        if static_dir.startswith("site/"):
            # Find project root by looking for scripts/ or site/ directory
            current = os.path.abspath(os.curdir)
            project_root = current
            # Go up until we find scripts/ or site/ directory
            while project_root and project_root != os.path.dirname(project_root):
                if os.path.exists(os.path.join(project_root, "scripts")) and os.path.exists(os.path.join(project_root, "site")):
                    break
                project_root = os.path.dirname(project_root)
            
            if project_root and project_root != os.path.dirname(project_root):
                # Make static_dir absolute relative to project root
                static_dir = os.path.normpath(os.path.join(project_root, static_dir))
            else:
                # Fallback: use absolute path from current directory
                static_dir = os.path.normpath(os.path.abspath(static_dir))
        else:
            # Other relative paths: resolve from current directory
            static_dir = os.path.normpath(os.path.abspath(static_dir))
    else:
        static_dir = os.path.normpath(static_dir)
    
    os.makedirs(static_dir, exist_ok=True)
    output_path = os.path.join(static_dir, "id-to-slug.json")
    
    try:
        logger.debug(f"Writing id-to-slug.json to: {output_path}")
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(clean_mapping, f, ensure_ascii=False, indent=2)
        logger.info(f"Generated id-to-slug.json with {len(clean_mapping)} mappings at {output_path}")
        # Verify file was written
        if not os.path.exists(output_path):
            logger.error(f"File was not created at {output_path}")
        else:
            logger.debug(f"Verified: file exists at {output_path}")
    except Exception as e:
        logger.error(f"Failed to write id-to-slug.json: {e}", exc_info=True)


def copy_source_content(src_content_dir: str, dst_content_dir: str, link_converter=None):
    """
    Copy source content (index.md, pages/) to site/content/ and process profile links.
    
    Args:
        src_content_dir: Source content directory (e.g., "content")
        dst_content_dir: Destination content directory (e.g., "site/content")
        link_converter: Optional LinkConverter for processing [Name|ID] links
    
    Example:
        >>> copy_source_content("content", "site/content", link_converter)
    """
    logger.info(f"Copying source content from {src_content_dir} to {dst_content_dir}")
    
    os.makedirs(dst_content_dir, exist_ok=True)
    
    # Copy index.md
    src_index = os.path.join(src_content_dir, "index.md")
    if os.path.exists(src_index):
        dst_index = os.path.join(dst_content_dir, "index.md")
        copy_file_safe(src_index, dst_index)
    
    # Copy and process pages/ directory
    src_pages = os.path.join(src_content_dir, "pages")
    dst_pages = os.path.join(dst_content_dir, "pages")
    
    if os.path.exists(src_pages):
        os.makedirs(dst_pages, exist_ok=True)
        for filename in os.listdir(src_pages):
            if not filename.endswith('.md'):
                # Copy non-markdown files as-is
                src_file = os.path.join(src_pages, filename)
                dst_file = os.path.join(dst_pages, filename)
                copy_file_safe(src_file, dst_file)
                continue
            
            src_file = os.path.join(src_pages, filename)
            dst_file = os.path.join(dst_pages, filename)
            
            try:
                # Read content
                with open(src_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Process [Name|ID] links if converter available
                # For static pages, convert to Markdown links (not HTML) since Quartz will process them
                if link_converter:
                    content = link_converter.convert_ids_to_markdown_links(content)
                
                # Write processed content
                with open(dst_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                logger.debug(f"  Copied and processed {filename}")
            except Exception as e:
                logger.error(f"Failed to process {filename}: {e}")
                # Fallback to simple copy
                copy_file_safe(src_file, dst_file)


def clean_project():
    """Remove all generated files and build outputs."""
    logger.info("Cleaning project...")
    
    # Calculate paths based on output directory
    # DEFAULT_OUTPUT_DIR is like "platform/site/content/profiles"
    # Extract base content directory (remove /profiles)
    output_base = os.path.dirname(DEFAULT_OUTPUT_DIR)  # e.g., "platform/site/content"
    content_dir = output_base  # e.g., "platform/site/content"
    site_dir = os.path.dirname(output_base)  # e.g., "platform/site"
    
    # Calculate static directory paths
    static_dir = DEFAULT_STATIC_DIR  # e.g., "platform/site/quartz/static"
    
    paths_to_remove = [
        content_dir,  # All content (profiles, index.md, pages/)
        os.path.join(site_dir, "public"),   # Quartz build output
        os.path.join(site_dir, ".quartz-cache"),  # Quartz cache
        os.path.join(site_dir, "site"),  # Accidentally created nested directory
        os.path.join(static_dir, "family-data.json"),  # Generated family data
        os.path.join(static_dir, "media-index.json"),  # Generated media index
        os.path.join(static_dir, "chapters-index.json"),  # Generated chapters index
        os.path.join(static_dir, "backlinks-index.json"),  # Generated backlinks index
        os.path.join(static_dir, "documents"),  # Copied documents directory
        os.path.join(static_dir, "chapters"),  # Copied chapters directory
    ]
    
    for path in paths_to_remove:
        full_path = os.path.abspath(path)
        if os.path.exists(full_path):
            if os.path.isdir(full_path):
                if remove_directory_safe(full_path):
                    logger.info(f"  Removed directory: {path}")
            else:
                try:
                    os.remove(full_path)
                    logger.info(f"  Removed file: {path}")
                except Exception as e:
                    logger.warning(f"  Could not remove {path}: {e}")
        else:
            logger.debug(f"  Not found, skipping: {path}")
    
    logger.info("Clean complete!")


# ============================================================================
# Helper Functions
# ============================================================================

def _collect_bio_ids(bios_dir: str) -> set:
    """
    Collect all profile IDs that have biographies.
    
    Returns:
        Set of profile IDs (without @ symbols)
    """
    bio_ids = set()
    
    if not os.path.exists(bios_dir):
        return bio_ids
    
    for entry in os.listdir(bios_dir):
        entry_path = os.path.join(bios_dir, entry)
        
        # Check if it's a direct .md file
        if entry.endswith(('.md', '.MD')):
            bio_ids.add(os.path.splitext(entry)[0])
        
        # Check if it's a directory (chapter-based biography)
        elif os.path.isdir(entry_path) and not entry.startswith('.'):
            # Check if there's a main bio file (e.g., I10/I10.md)
            main_bio_file = os.path.join(entry_path, f"{entry}.md")
            if os.path.isfile(main_bio_file):
                bio_ids.add(entry)
    
    # Also include profiles with shared chapters
    shared_chapters_path = os.path.join(bios_dir, "shared_chapters.json")
    if os.path.exists(shared_chapters_path):
        try:
            with open(shared_chapters_path, 'r', encoding='utf-8') as f:
                shared_chapters_config = json.load(f)
            for profile_id in shared_chapters_config.keys():
                bio_ids.add(profile_id)
            logger.debug(f"Added {len(shared_chapters_config)} profiles with shared chapters")
        except Exception as e:
            logger.warning(f"Error loading shared_chapters.json: {e}")
    
    return bio_ids


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


def _extract_gedcom_id(profile_path: str) -> str:
    """
    Extract GEDCOM ID from profile frontmatter.
    
    Args:
        profile_path: Path to profile markdown file
    
    Returns:
        GEDCOM ID (without @ symbols) or None if not found
    """
    try:
        with open(profile_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract cleaned GEDCOM ID from frontmatter property `ID`
        parts = content.split('---', 2)
        if len(parts) > 2:
            fm = parts[1]
            for ln in fm.splitlines():
                if ln.strip().startswith('ID:'):
                    gedcom_id = ln.split(':', 1)[1].strip().strip("'\"")
                    return gedcom_id
    except Exception as e:
        logger.warning(f"Error reading {profile_path}: {e}")
    
    return None


def _create_empty_gallery_index(pages_dir: str):
    """Create empty gallery index when media-index.json doesn't exist."""
    lines = [
        "## Profiles with Gallery\n",
        "This page lists family members who have images in their gallery.\n",
        "*No gallery images available yet.*"
    ]
    
    os.makedirs(pages_dir, exist_ok=True)
    output_path = os.path.join(pages_dir, "profiles-with-gallery.md")
    
    try:
        with open(output_path, "w", encoding="utf-8") as f:
            f.write("\n".join(lines) + "\n")
    except Exception as e:
        logger.error(f"Failed to write empty gallery index: {e}")


def write_family_pages(individuals: Dict, people_dir: str, pages_dir: str, id_to_slug: Dict):
    """
    Create a page for each family tree/source.
    Each page lists all profiles from that tree.
    If a person appears in multiple trees, they will appear in all relevant pages.
    
    Args:
        individuals: Raw individuals dictionary from GEDCOM
        people_dir: Directory containing profile markdown files
        pages_dir: Directory to write family pages to
        id_to_slug: Mapping from person ID to slug
    """
    logger.info("Creating family tree pages...")
    
    # Group individuals by source
    families_by_source = {}
    for pid, person_data in individuals.items():
        source = person_data.get("_SOURCE", "Unknown")
        # Handle multiple sources (comma-separated)
        sources = [s.strip() for s in source.split(",")]
        for src in sources:
            if src not in families_by_source:
                families_by_source[src] = []
            if pid not in families_by_source[src]:
                families_by_source[src].append(pid)
    
    os.makedirs(pages_dir, exist_ok=True)
    
    # Create a page for each family
    for source_name, person_ids in families_by_source.items():
        # Remove .ged extension if present, and create slug-friendly filename
        clean_name = source_name
        if clean_name.endswith('.ged'):
            clean_name = clean_name[:-4]  # Remove .ged
        
        family_slug = clean_name.lower().replace(" ", "-").replace("_", "-")
        family_slug = "".join(c for c in family_slug if c.isalnum() or c == "-")
        
        # Use clean name for display (without .ged)
        display_name = clean_name.replace("_", " ").title()
        
        # Get profile links for this family
        lines = [
            f"---",
            f"title: {display_name} Profiles",
            f"---",
            f"",
            f"## {display_name} Profiles",
            f"",
            f"This page lists all family members from the {display_name} tree.",
            f""
        ]
        
        # Sort by name for display
        profiles = []
        for pid in person_ids:
            person = individuals[pid]
            # Skip private profiles
            if _is_private_tag(person):
                continue
            name = person.get("NAME", "Unknown")
            slug = id_to_slug.get(pid, None)
            if slug:
                display_name_profile = slug.replace('-', ' ')
                url = "/profiles/" + urllib.parse.quote(slug)
                profiles.append((name, display_name_profile, url))
        
        profiles.sort(key=lambda x: x[0])  # Sort by name
        
        if profiles:
            lines.append(f"**Total: {len(profiles)} profiles**\n")
            for name, display_name_profile, url in profiles:
                lines.append(f"* [{display_name_profile}]({url})")
        else:
            lines.append("*No profiles available.*")
        
        output_path = os.path.join(pages_dir, f"family-{family_slug}.md")
        try:
            with open(output_path, "w", encoding="utf-8") as f:
                f.write("\n".join(lines) + "\n")
            logger.info(f"Created family page: family-{family_slug}.md with {len(profiles)} profiles")
        except Exception as e:
            logger.error(f"Failed to write family-{family_slug}.md: {e}")


def write_family_trees_json(individuals: Dict, static_dir: str):
    """
    Create family-trees.json that maps tree name to list of profile IDs.
    This is used by JavaScript to filter images by family tree.
    
    Args:
        individuals: Raw individuals dictionary from GEDCOM
        static_dir: Directory to write JSON file to
    """
    logger.info("Creating family-trees.json...")
    
    # Group individuals by source
    families_by_source = {}
    for pid, person_data in individuals.items():
        source = person_data.get("_SOURCE", "Unknown")
        # Handle multiple sources (comma-separated)
        sources = [s.strip() for s in source.split(",")]
        for src in sources:
            # Remove .ged extension if present
            clean_source = src
            if clean_source.endswith('.ged'):
                clean_source = clean_source[:-4]
            
            if clean_source not in families_by_source:
                families_by_source[clean_source] = []
            # Store GEDCOM ID without @ symbols (as used in media-index.json)
            clean_id = pid.strip("@")
            if clean_id not in families_by_source[clean_source]:
                families_by_source[clean_source].append(clean_id)
    
    os.makedirs(static_dir, exist_ok=True)
    output_path = os.path.join(static_dir, "family-trees.json")
    
    try:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(families_by_source, f, ensure_ascii=False, indent=2)
        logger.info(f"Created family-trees.json with {len(families_by_source)} trees")
    except Exception as e:
        logger.error(f"Failed to write family-trees.json: {e}")


def write_family_images_pages(individuals: Dict, pages_dir: str):
    """
    Create image gallery pages for each family tree.
    Similar to all-images.md but filtered by family tree.
    
    Args:
        individuals: Raw individuals dictionary from GEDCOM
        pages_dir: Directory to write family image pages to
    """
    logger.info("Creating family image gallery pages...")
    
    # Group individuals by source
    families_by_source = {}
    for pid, person_data in individuals.items():
        source = person_data.get("_SOURCE", "Unknown")
        sources = [s.strip() for s in source.split(",")]
        for src in sources:
            clean_source = src
            if clean_source.endswith('.ged'):
                clean_source = clean_source[:-4]
            
            if clean_source not in families_by_source:
                families_by_source[clean_source] = []
    
    os.makedirs(pages_dir, exist_ok=True)
    
    # Create a page for each family
    for source_name in families_by_source.keys():
        # Create slug-friendly filename
        family_slug = source_name.lower().replace(" ", "-").replace("_", "-")
        family_slug = "".join(c for c in family_slug if c.isalnum() or c == "-")
        
        # Use clean name for display
        display_name = source_name.replace("_", " ").title()
        
        # Create markdown file similar to all-images.md
        # Note: data-family-tree is not needed here - JavaScript will extract it from the slug
        lines = [
            f"---",
            f"title: {display_name} Images",
            f"---",
            f"",
            f"<div id=\"all-images-gallery-container\">",
            f"  <div class=\"loading-message\">Loading images from {display_name}...</div>",
            f"</div>",
            f""
        ]
        
        output_path = os.path.join(pages_dir, f"family-{family_slug}-images.md")
        try:
            with open(output_path, "w", encoding="utf-8") as f:
                f.write("\n".join(lines) + "\n")
            logger.info(f"Created family image page: family-{family_slug}-images.md")
        except Exception as e:
            logger.error(f"Failed to write family-{family_slug}-images.md: {e}")