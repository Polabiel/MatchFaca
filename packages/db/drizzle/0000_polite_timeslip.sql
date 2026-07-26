CREATE TYPE "public"."fight_request_status" AS ENUM('pending', 'accepted', 'declined');--> statement-breakpoint
CREATE TYPE "public"."fight_result" AS ENUM('knockout', 'submission', 'desistência', 'empate', 'nocaute_técnico', 'finalizado');--> statement-breakpoint
CREATE TYPE "public"."fight_status" AS ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."fighting_style" AS ENUM('boxe', 'muay_thai', 'jiu_jitsu', 'mma', 'kickboxing', 'capoeira', 'karate', 'judô', 'taekwondo', 'luta_livre', 'vale_tudo', 'porrada_limpa', 'outro');--> statement-breakpoint
CREATE TYPE "public"."weight_class" AS ENUM('até_66kg', 'até_77kg', 'até_93kg', 'acima_93kg');--> statement-breakpoint
CREATE TABLE "account" (
	"user_id" uuid NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" varchar(255),
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "fight" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fight_request_id" uuid NOT NULL,
	"scheduled_at" timestamp with time zone,
	"location_name" varchar(255),
	"latitude" double precision,
	"longitude" double precision,
	"winner_id" uuid,
	"status" "fight_status" DEFAULT 'scheduled' NOT NULL,
	"result" "fight_result",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "fight_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenger_id" uuid NOT NULL,
	"challenged_id" uuid NOT NULL,
	"message" varchar(280),
	"status" "fight_request_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fight_request_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"nickname" varchar(60) NOT NULL,
	"photo" varchar(512),
	"bio" text,
	"fighting_style" "fighting_style" DEFAULT 'outro' NOT NULL,
	"weight_class" "weight_class",
	"wins" integer DEFAULT 0 NOT NULL,
	"losses" integer DEFAULT 0 NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"location_name" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone,
	"image" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fight" ADD CONSTRAINT "fight_fight_request_id_fight_request_id_fk" FOREIGN KEY ("fight_request_id") REFERENCES "public"."fight_request"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fight" ADD CONSTRAINT "fight_winner_id_user_id_fk" FOREIGN KEY ("winner_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fight_request" ADD CONSTRAINT "fight_request_challenger_id_user_id_fk" FOREIGN KEY ("challenger_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fight_request" ADD CONSTRAINT "fight_request_challenged_id_user_id_fk" FOREIGN KEY ("challenged_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_fight_request_id_fight_request_id_fk" FOREIGN KEY ("fight_request_id") REFERENCES "public"."fight_request"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "fight_fight_request_idx" ON "fight" USING btree ("fight_request_id");--> statement-breakpoint
CREATE INDEX "fight_status_idx" ON "fight" USING btree ("status");--> statement-breakpoint
CREATE INDEX "fr_challenger_idx" ON "fight_request" USING btree ("challenger_id");--> statement-breakpoint
CREATE INDEX "fr_challenged_idx" ON "fight_request" USING btree ("challenged_id");--> statement-breakpoint
CREATE INDEX "fr_status_idx" ON "fight_request" USING btree ("status");--> statement-breakpoint
CREATE INDEX "msg_fight_request_idx" ON "message" USING btree ("fight_request_id");--> statement-breakpoint
CREATE UNIQUE INDEX "profile_user_id_idx" ON "profile" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "profile_location_idx" ON "profile" USING btree ("latitude","longitude");