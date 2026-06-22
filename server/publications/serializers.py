import bleach
from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Category, Comment, Publication

User = get_user_model()

ALLOWED_TAGS = [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "a",
    "ul",
    "ol",
    "li",
    "blockquote",
    "h2",
    "h3",
    "h4",
    "pre",
    "code",
    "img",
    "figure",
    "figcaption",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "hr",
]
ALLOWED_ATTRS = {
    "a": ["href", "title", "rel", "target"],
    "img": ["src", "alt", "title", "class"],
    "*": ["class"],
}


class UserBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "avatar")


class PublicationSerializer(serializers.ModelSerializer):
    author = UserBriefSerializer(read_only=True)
    categories = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True, required=False)

    class Meta:
        model = Publication
        fields = (
            "id",
            "title",
            "slug",
            "content",
            "excerpt",
            "author",
            "categories",
            "featured_image",
            "created_at",
            "updated_at",
            "published_at",
            "status",
            "views_count",
            "is_featured",
            "allow_comments",
            "meta_title",
            "meta_description",
            "keywords",
            "additional_metadata",
            "content_format",
        )
        read_only_fields = ("id", "slug", "created_at", "updated_at", "published_at", "views_count")

    def validate(self, attrs):
        if attrs.get("content_format") == "html" and attrs.get("content"):
            attrs["content"] = bleach.clean(
                attrs["content"],
                tags=ALLOWED_TAGS,
                attributes=ALLOWED_ATTRS,
                strip=True,
            )
        return attrs


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name", "slug", "description")
        read_only_fields = ("id",)


class CommentSerializer(serializers.ModelSerializer):
    author = UserBriefSerializer(read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ("id", "content", "created_at", "author", "is_approved", "parent", "replies")
        read_only_fields = ("id", "created_at", "is_approved")

    def get_replies(self, obj):
        if not hasattr(obj, "replies"):
            return []
        return CommentBriefSerializer(obj.replies.filter(is_approved=True), many=True).data


class CommentBriefSerializer(serializers.ModelSerializer):
    author = UserBriefSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ("id", "content", "created_at", "author")
        read_only_fields = ("id", "created_at")


class PublicationListSerializer(serializers.ModelSerializer):
    author = UserBriefSerializer(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()

    author_name = serializers.CharField(source="author.get_full_name", read_only=True)
    categories_names = serializers.CharField(source="get_categories_names", read_only=True)
    category_name = serializers.CharField(read_only=True)

    class Meta:
        model = Publication
        fields = (
            "id",
            "title",
            "slug",
            "excerpt",
            "author",
            "categories",
            "featured_image",
            "created_at",
            "published_at",
            "status",
            "views_count",
            "is_featured",
            "comments_count",
            "content",
            "author_name",
            "categories_names",
            "category_name",
            "mins_read",
            "content_format",
        )
        read_only_fields = ("id", "slug", "created_at", "published_at", "views_count")

    def get_category_name(self, obj):
        if obj.categories.exists():
            return obj.categories.first().name
        return None

    def get_comments_count(self, obj):
        return obj.comments.filter(is_approved=True).count()


class PublicationDetailSerializer(serializers.ModelSerializer):
    author = UserBriefSerializer(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Publication
        fields = (
            "id",
            "title",
            "slug",
            "content",
            "excerpt",
            "author",
            "categories",
            "featured_image",
            "created_at",
            "updated_at",
            "published_at",
            "status",
            "views_count",
            "is_featured",
            "allow_comments",
            "meta_title",
            "meta_description",
            "keywords",
            "additional_metadata",
            "comments",
            "mins_read",
            "content_format",
        )
        read_only_fields = ("id", "slug", "created_at", "updated_at", "published_at", "views_count")

    def get_comments(self, obj):
        # Only return top-level comments (no parent)
        return CommentSerializer(obj.comments.filter(is_approved=True, parent=None), many=True).data


class PublicationCreateUpdateSerializer(serializers.ModelSerializer):
    categories = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True, required=False)
    title = serializers.CharField(required=False, allow_blank=True, max_length=255)
    content = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Publication
        fields = (
            "title",
            "content",
            "excerpt",
            "categories",
            "featured_image",
            "status",
            "is_featured",
            "allow_comments",
            "meta_title",
            "meta_description",
            "keywords",
            "additional_metadata",
            "mins_read",
            "content_format",
        )

    def validate(self, attrs):
        status_value = attrs.get("status", getattr(self.instance, "status", "draft"))
        title = attrs.get("title", getattr(self.instance, "title", "")) or ""
        content = attrs.get("content", getattr(self.instance, "content", "")) or ""

        if status_value == "published" and not title.strip():
            raise serializers.ValidationError({"title": "Title is required when publishing."})

        if status_value == "published" and not content.strip():
            raise serializers.ValidationError({"content": "Content is required when publishing."})

        if attrs.get("content_format", "html") == "html" and content:
            attrs["content"] = bleach.clean(
                content,
                tags=ALLOWED_TAGS,
                attributes=ALLOWED_ATTRS,
                strip=True,
            )
        return attrs

    def create(self, validated_data):
        categories_data = validated_data.pop("categories", [])
        author = validated_data.pop("author", None) or self.context["request"].user
        publication = Publication.objects.create(author=author, **validated_data)
        if categories_data:
            publication.categories.set(categories_data)
        return publication

    def update(self, instance, validated_data):
        categories_data = validated_data.pop("categories", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if categories_data is not None:
            instance.categories.set(categories_data)
        return instance
