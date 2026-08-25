CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" integer NOT NULL,
	"author_name" text NOT NULL,
	"body" text NOT NULL,
	"comment_ip_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"rawg_id" integer NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"cover_image_url" text,
	"description" text,
	"genres" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"platforms" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"release_date" date,
	"rawg_rating" numeric(3, 2),
	"rawg_metadata" jsonb,
	"star_rating" integer,
	"manual_rank" integer,
	"owner_review" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "comments_game_id_idx" ON "comments" USING btree ("game_id");--> statement-breakpoint
CREATE UNIQUE INDEX "games_slug_idx" ON "games" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "games_rawg_id_idx" ON "games" USING btree ("rawg_id");--> statement-breakpoint
CREATE INDEX "games_manual_rank_idx" ON "games" USING btree ("manual_rank");--> statement-breakpoint
CREATE INDEX "games_star_rating_idx" ON "games" USING btree ("star_rating");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");