// Import any needed model functions
import { getAllCategories, getCategoryDetails, getCategoriesByProject, getProjectsByCategory, updateCategoryAssignments, createCategory, updateCategory } from '../models/categories.js';
import { getProjectDetails} from '../models/projects.js';

import { body, validationResult } from 'express-validator';

const categoryValidation = [
    body('category_name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Name must be between 3 and 100 characters')
];

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};  


const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const CategoryDetails = await getCategoryDetails(categoryId);
    const ProjectsByCategoryDetails = await getProjectsByCategory(categoryId);
    const title = 'Category Details';

    res.render('category', {title, CategoryDetails, ProjectsByCategoryDetails});
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProject(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

const showNewCategoryForm = async (req, res) => {
    const title = 'Add New Category';
    res.render('new-category', { title});
}

const processNewCategoryForm = async (req, res) => {

        // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new category form
        return res.redirect('/new-category');
    }
    
    
    console.log('req.body:', req.body);
    // Extract form data from req.body
    const { category_name } = req.body;

    try {
        // Create the new project in the database
        const newCategoryId = await createCategory(category_name);

        req.flash('success', 'New category created successfully!');
        res.redirect(`/category/${newCategoryId}`);
    } catch (error) {
        console.error('Error creating new category:', error);
        req.flash('error', 'There was an error creating the category.');
        res.redirect('/new-category');
    }
}

const showEditCategoryForm = async (req, res) => {
    console.log('req.params:', req.params);
    const categoryId = req.params.id;
    console.log('id:', categoryId);
    const categoryDetails = await getCategoryDetails(categoryId);

    const title = 'Edit Category';
    res.render('edit-category', { title, categoryDetails });
};

const processEditCategoryForm = async (req, res) => {

    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit category form
        return res.redirect('/edit-category/' + req.params.id);
    }
    
    console.log('req.params:', req.params);

    const categoryId = req.params.id;
    const { category_name } = req.body;    

    try {

        // update the category in the database
        await updateCategory(categoryId, category_name);
        // Set a success flash message
        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${categoryId}`);

    } catch (error) {
        console.error('Error updating category:', error);
        req.flash('error', 'There was an database error updating the category. Please check if category name already exist.');
        res.redirect('/edit-category/' + req.params.id);
    }





};

// Export any controller functions
export { 
    showCategoriesPage , 
    showCategoryDetailsPage, 
    showAssignCategoriesForm, 
    processAssignCategoriesForm, 
    categoryValidation, 
    showNewCategoryForm, 
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
};