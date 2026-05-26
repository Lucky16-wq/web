import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1689999999999 implements MigrationInterface {
  name = 'CreateInitialSchema1689999999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" character varying,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_roles" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_roles_name" UNIQUE ("name")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "fullName" character varying NOT NULL,
        "email" character varying NOT NULL,
        "phone" character varying,
        "password" character varying,
        "roleId" uuid,
        "isEmailVerified" boolean NOT NULL DEFAULT false,
        "isActive" boolean NOT NULL DEFAULT true,
        "profile" json,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "venues" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "description" text NOT NULL,
        "location" character varying NOT NULL,
        "address" character varying NOT NULL,
        "basePrice" numeric(12,2) NOT NULL,
        "capacity" integer NOT NULL DEFAULT 0,
        "facilities" text,
        "isActive" boolean NOT NULL DEFAULT true,
        "schedule" json,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_venues" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "venue_images" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "url" character varying NOT NULL,
        "caption" character varying,
        "venueId" uuid,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_venue_images" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "booking_status" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "code" character varying NOT NULL,
        "label" character varying NOT NULL,
        "description" character varying,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_booking_status" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_booking_status_code" UNIQUE ("code")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "bookings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid,
        "venueId" uuid,
        "statusId" uuid,
        "startAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "endAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "totalPrice" numeric(12,2) NOT NULL,
        "purpose" text,
        "documents" json,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_bookings" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "negotiations" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "bookingId" uuid,
        "proposerRole" character varying NOT NULL,
        "proposedPrice" numeric(12,2),
        "message" text,
        "accepted" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_negotiations" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "chats" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "customerId" uuid,
        "adminId" uuid,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_chats" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "chat_messages" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "chatId" uuid,
        "sender" character varying NOT NULL,
        "content" text NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_chat_messages" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "bookingId" uuid,
        "provider" character varying NOT NULL,
        "providerReference" character varying NOT NULL,
        "amount" numeric(12,2) NOT NULL,
        "status" character varying NOT NULL DEFAULT 'pending',
        "paidAt" TIMESTAMP WITH TIME ZONE,
        "expiresAt" TIMESTAMP WITH TIME ZONE,
        "metadata" json,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_payments" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "invoices" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "bookingId" uuid,
        "invoiceNumber" character varying NOT NULL,
        "amount" numeric(12,2) NOT NULL,
        "status" character varying NOT NULL DEFAULT 'draft',
        "issuedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "dueDate" TIMESTAMP WITH TIME ZONE,
        "pdfUrl" character varying,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_invoices" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_invoices_invoiceNumber" UNIQUE ("invoiceNumber")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "contracts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "bookingId" uuid,
        "terms" text NOT NULL,
        "agreedPrice" numeric(12,2) NOT NULL,
        "durationHours" integer,
        "signedByCustomer" boolean NOT NULL DEFAULT false,
        "signedByAdmin" boolean NOT NULL DEFAULT false,
        "signedAt" TIMESTAMP WITH TIME ZONE,
        "pdfUrl" character varying,
        "qrCodeUrl" character varying,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_contracts" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "documents" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "bookingId" uuid,
        "type" character varying NOT NULL,
        "title" character varying NOT NULL,
        "url" character varying NOT NULL,
        "checksum" character varying,
        "metadata" json,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_documents" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid,
        "title" character varying NOT NULL,
        "body" text NOT NULL,
        "category" character varying NOT NULL DEFAULT 'system',
        "read" boolean NOT NULL DEFAULT false,
        "payload" json,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notifications" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" character varying,
        "action" character varying NOT NULL,
        "resource" character varying,
        "ipAddress" character varying,
        "userAgent" character varying,
        "metadata" json,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_users_role" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "venue_images" ADD CONSTRAINT "FK_venue_images_venue" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_bookings_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_bookings_venue" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_bookings_status" FOREIGN KEY ("statusId") REFERENCES "booking_status"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "negotiations" ADD CONSTRAINT "FK_negotiations_booking" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_chats_customer" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_chats_admin" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_chat_messages_chat" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_payments_booking" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_invoices_booking" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_contracts_booking" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_documents_booking" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_notifications_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_notifications_user"`);
    await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_documents_booking"`);
    await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_contracts_booking"`);
    await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_invoices_booking"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_payments_booking"`);
    await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_chat_messages_chat"`);
    await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_chats_admin"`);
    await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_chats_customer"`);
    await queryRunner.query(`ALTER TABLE "negotiations" DROP CONSTRAINT "FK_negotiations_booking"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_bookings_status"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_bookings_venue"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_bookings_user"`);
    await queryRunner.query(`ALTER TABLE "venue_images" DROP CONSTRAINT "FK_venue_images_venue"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_role"`);
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "documents"`);
    await queryRunner.query(`DROP TABLE "contracts"`);
    await queryRunner.query(`DROP TABLE "invoices"`);
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TABLE "chat_messages"`);
    await queryRunner.query(`DROP TABLE "chats"`);
    await queryRunner.query(`DROP TABLE "negotiations"`);
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TABLE "booking_status"`);
    await queryRunner.query(`DROP TABLE "venue_images"`);
    await queryRunner.query(`DROP TABLE "venues"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
