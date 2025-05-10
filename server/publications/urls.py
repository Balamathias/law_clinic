from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PublicationViewSet, CategoryViewSet

router = DefaultRouter()
# Publications endpoints:
# GET /api/publications/ - List all publications with pagination
# POST /api/publications/ - Create a new publication
# GET /api/publications/{id}/ - Retrieve a specific publication by id
# PUT /api/publications/{id}/ - Update a publication completely
# PATCH /api/publications/{id}/ - Update a publication partially
# DELETE /api/publications/{id}/ - Delete a publication
router.register('', PublicationViewSet, basename='publication')

# Categories endpoints:
# GET /api/categories/ - List all categories
# POST /api/categories/ - Create a new category
# GET /api/categories/{id}/ - Retrieve a specific category by id
# PUT /api/categories/{id}/ - Update a category completely
# PATCH /api/categories/{id}/ - Update a category partially
# DELETE /api/categories/{id}/ - Delete a category
router.register('categories', CategoryViewSet, basename='category')

app_name = 'publications'

urlpatterns = [
    # Includes all endpoints defined in the router
    path('', include(router.urls)),
]

"""
API Documentation:

Publications API:
----------------
- List Publications:
  * URL: /api/publications/
  * Method: GET
  * Description: Returns paginated list of all publications
  * Query parameters:
    - page: Page number
    - search: Text to search in title and content
    - category: Filter by category ID
    - ordering: Order by field (e.g., '-created_at' for newest first)
  * Response: 200 OK with list of publications

- Create Publication:
  * URL: /api/publications/
  * Method: POST
  * Description: Creates a new publication
  * Auth required: Yes
  * Request body: 
    {
      "title": "Publication Title",
      "content": "Full content text",
      "summary": "Brief summary",
      "category": category_id,
      "image": "url_to_image",
      "is_published": true/false
    }
  * Response: 201 Created with publication data

- Retrieve Publication:
  * URL: /api/publications/{id}/
  * Method: GET
  * Description: Returns a specific publication
  * Response: 200 OK with publication data or 404 Not Found

- Update Publication:
  * URL: /api/publications/{id}/
  * Method: PUT/PATCH
  * Description: Updates a publication (complete/partial)
  * Auth required: Yes
  * Response: 200 OK with updated publication data

- Delete Publication:
  * URL: /api/publications/{id}/
  * Method: DELETE
  * Description: Deletes a publication
  * Auth required: Yes
  * Response: 204 No Content

Categories API:
--------------
- List Categories:
  * URL: /api/categories/
  * Method: GET
  * Description: Returns list of all categories
  * Response: 200 OK with list of categories

- Create Category:
  * URL: /api/categories/
  * Method: POST
  * Description: Creates a new category
  * Auth required: Yes
  * Request body:
    {
      "name": "Category Name",
      "description": "Category Description"
    }
  * Response: 201 Created with category data

- Retrieve Category:
  * URL: /api/categories/{id}/
  * Method: GET
  * Description: Returns a specific category
  * Response: 200 OK with category data or 404 Not Found

- Update Category:
  * URL: /api/categories/{id}/
  * Method: PUT/PATCH
  * Description: Updates a category (complete/partial)
  * Auth required: Yes
  * Response: 200 OK with updated category data

- Delete Category:
  * URL: /api/categories/{id}/
  * Method: DELETE
  * Description: Deletes a category
  * Auth required: Yes
  * Response: 204 No Content
"""