function formatProjects(rows = []) {
  return rows.map(row => ({
    project_id: row.project_id,
    org_short_name: row.org_short_name,
    project_name: row.project_name,

    project_site: row.project_site_name ? {
      project_site_name: row.project_site_name,
      project_site_lat: row.project_site_lat,
      project_site_long: row.project_site_long
    } : null,

    client_name: row.client_name,
    client_location: row.client_location,
    client_contact: row.client_contact,
    mng_name: row.mng_name,
    mng_email: row.mng_email,
    mng_contact: row.mng_contact,
    project_description: row.project_description,
    project_techstack: row.project_techstack,
    project_assigned_date: row.project_assigned_date,
    created_at: row.created_at,
    updated_at: row.updated_at
  }));
}

module.exports = { formatProjects };
