-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

SELECT organization_id, name, description, contact_email, logo_filename
FROM public.organization;


CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    project_date DATE NOT NULL,

    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);


INSERT INTO projects (organization_id, title, description, location, project_date)
VALUES
(1,'Community Food Drive','Collect and distribute food donations.','New York','2026-06-15'),
(2,'Neighborhood House Build','Volunteer construction project.','Chicago','2026-07-10'),
(3,'School Supply Campaign','Provide educational materials for children.','Washington','2026-08-05');

SELECT sp.project_id, sp.organization_id, o.name, sp.title, sp.description, sp.location, sp.project_date
FROM public.projects sp
INNER JOIN public.organization o 
on o.organization_id = sp.organization_id;


CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);


INSERT INTO category (category_name)
VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES projects(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
);

INSERT INTO project_category
(project_id, category_id)
VALUES
(1,3),
(1,2),
(2,2),
(3,1),
(3,2);

SELECT sp.project_id, sp.title, c.category_name
FROM projects sp
JOIN project_category pc
ON sp.project_id = pc.project_id
JOIN category c
ON pc.category_id = c.category_id
ORDER BY sp.project_id;