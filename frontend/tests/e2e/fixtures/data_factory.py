"""
Test data factory and generator utilities.

Provides factories for generating diverse, realistic test data
with edge cases for comprehensive test coverage.
"""

import logging
from dataclasses import dataclass
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random
import string

logger = logging.getLogger(__name__)


@dataclass
class MenuItem:
    """Data model for menu item."""
    id: int
    name: str
    category: str
    price: float
    description: str = None
    dietary_info: str = None
    image_url: str = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "price": self.price,
            "description": self.description,
            "dietary_info": self.dietary_info,
            "image_url": self.image_url
        }


@dataclass
class Chef:
    """Data model for chef."""
    id: int
    name: str
    bio: str = None
    specialties: str = None
    image_url: str = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "bio": self.bio,
            "specialties": self.specialties,
            "image_url": self.image_url
        }


@dataclass
class BlogPost:
    """Data model for blog post."""
    id: int
    title: str
    content: str
    author: str
    publish_date: str
    category: str = None
    featured_image: str = None
    read_time: int = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "author": self.author,
            "publish_date": self.publish_date,
            "category": self.category,
            "featured_image": self.featured_image,
            "read_time": self.read_time
        }


@dataclass
class ContactSubmission:
    """Data model for contact form submission."""
    id: int
    name: str
    email: str
    subject: str
    message: str
    phone: str = None
    submitted_at: str = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "subject": self.subject,
            "message": self.message,
            "phone": self.phone,
            "submitted_at": self.submitted_at
        }


@dataclass
class SubscriptionPlan:
    """Data model for subscription plan."""
    id: int
    name: str
    price: float
    billing_cycle: str
    features: List[str]
    description: str = None
    is_popular: bool = False
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "billing_cycle": self.billing_cycle,
            "features": self.features,
            "description": self.description,
            "is_popular": self.is_popular
        }


class TestDataFactory:
    """
    Factory for generating diverse test data.
    """
    
    def __init__(self):
        """Initialize test data factory."""
        self.counter = 1000
        logger.info("TestDataFactory initialized")
    
    def _get_id(self) -> int:
        """Generate unique ID."""
        self.counter += 1
        return self.counter
    
    def generate_menu_items(self, count: int = 5) -> List[MenuItem]:
        """
        Generate test menu items with diverse categories and prices.
        
        Args:
            count: Number of items to generate
            
        Returns:
            List of MenuItem objects
        """
        categories = ["appetizers", "mains", "desserts", "beverages", "sides"]
        items = []
        
        for i in range(count):
            item = MenuItem(
                id=self._get_id(),
                name=f"Test Dish {i+1}",
                category=random.choice(categories),
                price=round(random.uniform(5.99, 29.99), 2),
                description=f"A delicious test dish #{i+1}",
                dietary_info=random.choice(["vegetarian", "vegan", "gluten-free", None]),
                image_url=f"/images/dish-{i+1}.jpg"
            )
            items.append(item)
            logger.debug(f"Generated menu item: {item.name}")
        
        logger.info(f"Generated {len(items)} menu items")
        return items
    
    def generate_chefs(self, count: int = 3) -> List[Chef]:
        """
        Generate test chef profiles.
        
        Args:
            count: Number of chefs to generate
            
        Returns:
            List of Chef objects
        """
        specialties_list = [
            ["Italian", "Pasta"],
            ["French", "Sauces"],
            ["Asian", "Stir-fry"],
            ["Mexican", "Grilling"],
            ["Mediterranean", "Seafood"]
        ]
        
        chefs = []
        for i in range(count):
            chef = Chef(
                id=self._get_id(),
                name=f"Chef {chr(65+i)}",
                bio=f"Experienced chef with {10+i} years in fine dining",
                specialties=", ".join(random.choice(specialties_list)),
                image_url=f"/images/chef-{i+1}.jpg"
            )
            chefs.append(chef)
            logger.debug(f"Generated chef: {chef.name}")
        
        logger.info(f"Generated {len(chefs)} chefs")
        return chefs
    
    def generate_blog_posts(self, count: int = 5) -> List[BlogPost]:
        """
        Generate test blog posts.
        
        Args:
            count: Number of posts to generate
            
        Returns:
            List of BlogPost objects
        """
        categories = ["recipes", "cooking-tips", "chef-spotlight", "nutrition", "trends"]
        
        posts = []
        for i in range(count):
            post_date = (datetime.now() - timedelta(days=i*7)).isoformat()
            post = BlogPost(
                id=self._get_id(),
                title=f"Test Blog Post {i+1}: Testing Content",
                content=f"This is test blog post content #{i+1} with detailed information about {random.choice(categories)}.",
                author=f"Author {i+1}",
                publish_date=post_date,
                category=random.choice(categories),
                featured_image=f"/images/blog-{i+1}.jpg",
                read_time=random.randint(3, 15)
            )
            posts.append(post)
            logger.debug(f"Generated blog post: {post.title}")
        
        logger.info(f"Generated {len(posts)} blog posts")
        return posts
    
    def generate_contact_submissions(self, count: int = 3) -> List[ContactSubmission]:
        """
        Generate test contact form submissions.
        
        Args:
            count: Number of submissions to generate
            
        Returns:
            List of ContactSubmission objects
        """
        submissions = []
        for i in range(count):
            submission = ContactSubmission(
                id=self._get_id(),
                name=f"Test User {i+1}",
                email=f"testuser{i+1}@example.com",
                subject=f"Test Subject {i+1}",
                message=f"This is test message #{i+1} for contact form testing.",
                phone=f"+1-555-000-{1000+i}",
                submitted_at=datetime.now().isoformat()
            )
            submissions.append(submission)
            logger.debug(f"Generated contact submission from {submission.name}")
        
        logger.info(f"Generated {len(submissions)} contact submissions")
        return submissions
    
    def generate_subscription_plans(self, count: int = 3) -> List[SubscriptionPlan]:
        """
        Generate test subscription plans.
        
        Args:
            count: Number of plans to generate
            
        Returns:
            List of SubscriptionPlan objects
        """
        plan_names = ["Starter", "Professional", "Premium", "Enterprise"]
        
        plans = []
        for i in range(min(count, len(plan_names))):
            plan = SubscriptionPlan(
                id=self._get_id(),
                name=plan_names[i],
                price=round((i+1) * 9.99, 2),
                billing_cycle="monthly",
                features=[
                    f"Feature {j+1}" for j in range(3+i)
                ],
                description=f"{plan_names[i]} plan for test",
                is_popular=(i == 1)  # Make second plan popular
            )
            plans.append(plan)
            logger.debug(f"Generated subscription plan: {plan.name}")
        
        logger.info(f"Generated {len(plans)} subscription plans")
        return plans
    
    def generate_edge_case_data(self) -> Dict[str, Any]:
        """
        Generate edge case test data for validation testing.
        
        Returns:
            Dictionary with edge case data
        """
        edge_cases = {
            "empty_string": "",
            "very_long_string": "x" * 10000,
            "special_characters": "<>&\"'`",
            "unicode_characters": "café ✓ 你好 مرحبا",
            "sql_injection_attempt": "'; DROP TABLE users; --",
            "xss_payload": "<script>alert('xss')</script>",
            "null_value": None,
            "negative_number": -999,
            "zero": 0,
            "very_large_number": 999999999999,
            "boolean_true": True,
            "boolean_false": False,
            "array": [1, 2, 3],
            "nested_object": {"key": "value"},
        }
        
        logger.info("Generated edge case test data")
        return edge_cases
    
    # Aliases for conftest compatibility
    def create_menu_items(self, count: int = 5) -> List[MenuItem]:
        """Alias for generate_menu_items (used by conftest)."""
        return self.generate_menu_items(count)
    
    def create_chefs(self, count: int = 3) -> List[Chef]:
        """Alias for generate_chefs (used by conftest)."""
        return self.generate_chefs(count)
    
    def create_blog_posts(self, count: int = 5) -> List[BlogPost]:
        """Alias for generate_blog_posts (used by conftest)."""
        return self.generate_blog_posts(count)
    
    def generate_invalid_emails(self) -> List[str]:
        """
        Generate invalid email addresses for validation testing.
        
        Returns:
            List of invalid email strings
        """
        invalid_emails = [
            "notanemail",
            "@example.com",
            "user@",
            "user@.com",
            "user @example.com",
            "user@example",
            "user..name@example.com",
            ".user@example.com",
            "user.@example.com",
            "user@exam ple.com",
            "",
            None,
        ]
        
        logger.info(f"Generated {len([e for e in invalid_emails if e])} invalid email samples")
        return [e for e in invalid_emails if e is not None]
