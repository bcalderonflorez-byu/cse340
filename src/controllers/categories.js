// Import any needed model functions
import { getAllCategories, getCategoryDetails, getCategoriesByProject, getProjectsByCategory } from '../models/categories.js';

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


// Export any controller functions
export { showCategoriesPage , showCategoryDetailsPage};