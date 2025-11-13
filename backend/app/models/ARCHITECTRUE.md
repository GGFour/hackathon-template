# Models Architecture (Implemented)

Each table uses a UUID primary key and `created_at` / `updated_at` audit timestamps via `Timestamped`.

## User
Purpose: Represents a human user or automated agent with auth and profile state.  
Columns: `id` (PK), `email` (unique, indexed), `hashed_password`, `full_name`, `is_active` (indexed), `is_superuser` (indexed), `auth_provider` (indexed), `extras` (JSONB).  
Relationships: `items`, `events`, `files`, `api_keys`, `memberships`, `settings` (all cascade delete).  

## Organization
Purpose: Tenant / team container for shared resources.  
Columns: `id` (PK), `name` (indexed), `slug` (unique, indexed), `plan_type` (indexed), `meta_data` (JSONB).  
Relationships: `items`, `events`, `settings`, `memberships` (all cascade delete).  

## OrganizationMembership
Purpose: Links a user to an organization with a role.  
Columns: `id` (PK), `user_id` (FK CASCADE), `organization_id` (FK CASCADE), `role` (indexed), `joined_at`.  
Relationships: `user`, `organization`.  
Uniqueness: No explicit uniqueness on (`user_id`, `organization_id`) (duplicates currently possible).  

## Item
Purpose: Generic owned object (dataset, prompt, model reference, etc).  
Columns: `id` (PK), `owner_id` (FK CASCADE), `organization_id` (FK SET NULL), `type` (indexed), `title` (indexed), `description`, `meta_data` (JSONB).  
Relationships: `owner`, `organization`, `contents`, `embeddings`, `files`, `events` (all cascade delete), `tags` (many-to-many via `ItemTagLink`).  

## Content
Purpose: Textual / structured message or prompt segment attached to an item.  
Columns: `id` (PK), `item_id` (FK CASCADE), `role` (indexed), `text`, `meta_data` (JSONB).  
Relationships: `item`, `embedding` (one-to-one optional).  

## Embedding
Purpose: Vector representation linked to content or item and an AI model.  
Columns: `id` (PK), `model_id` (FK CASCADE), `content_id` (FK CASCADE, unique, indexed, nullable), `item_id` (FK CASCADE, nullable), `vector` (JSONB list), `dim`, `meta_data` (JSONB).  
Relationships: `content`, `item`, `ai_model`.  
Constraint: `content_id` unique → enforces at most one embedding per content.

## FileAsset
Purpose: Uploaded or generated file tied to a user and optionally an item.  
Columns: `id` (PK), `owner_id` (FK CASCADE), `item_id` (FK SET NULL), `filename`, `path` (unique), `mime_type`, `size_bytes`, `checksum`, `meta_data` (JSONB).  
Relationships: `owner`, `item`.  

## Event
Purpose: Tracks actions / activities (auditing + analytics).  
Columns: `id` (PK), `actor_id` (FK SET NULL), `organization_id` (FK SET NULL), `item_id` (FK SET NULL), `model_id` (FK SET NULL), `event_type` (indexed), `payload` (JSONB).  
Relationships: `actor` (user), `organization`, `item`, `ai_model`.  

## Tag
Purpose: Lightweight classification label.  
Columns: `id` (PK), `name` (indexed), `color`.  
Relationships: `items` (many-to-many via link table).

## ItemTagLink (association)
Purpose: Joins items and tags.  
Columns: `item_id` (FK CASCADE, part PK), `tag_id` (FK CASCADE, part PK).  
Uniqueness: Composite PK ensures uniqueness of each (item, tag) pair.

## Setting
Purpose: Configuration entry at global / user / organization scope.  
Columns: `id` (PK), `scope` (indexed enum), `key` (indexed), `value` (JSONB), `user_id` (FK CASCADE nullable), `organization_id` (FK CASCADE nullable).  
Relationships: `user`, `organization`.  
Uniqueness: No implemented composite uniqueness on (`scope`, `key`, `user_id`, `organization_id`).

## AIModel
Purpose: Registered AI model reference with parameters and metadata.  
Columns: `id` (PK), `name` (indexed), `provider` (indexed), `version` (indexed nullable), `parameters` (JSONB), `meta_data` (JSONB).  
Relationships: `embeddings`, `events` (cascade delete).  

## APIKey
Purpose: Key for programmatic access scoped to a user.  
Columns: `id` (PK), `key_hash` (unique, indexed), `user_id` (FK CASCADE), `description`, `scopes` (JSONB list), `expires_at`, `last_used_at`.  
Relationships: `user`.  

## Common Patterns
- All JSON fields stored as `JSONB` (`extras`, `meta_data`, `payload`, `parameters`, `value`, `vector`, `scopes`).
- Cascade deletion applied on ownership relations to prevent orphaned rows.
- Some nullable FKs use `SET NULL` to preserve related records (`organization_id` on `Item`, `actor_id` etc. on `Event`, `item_id` on `FileAsset`).
- One-to-one enforced by `Embedding.content_id` unique constraint.
