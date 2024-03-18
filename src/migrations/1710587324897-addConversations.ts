import {MigrationInterface, QueryRunner} from "typeorm";

export class addConversations1710587324897 implements MigrationInterface {
    name = 'addConversations1710587324897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "conversations" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "participants_ids" integer array NOT NULL DEFAULT '{}', CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_conversations_conversations" ("users_id" integer NOT NULL, "conversations_id" integer NOT NULL, CONSTRAINT "PK_928c5ce99e7178581e120daeadd" PRIMARY KEY ("users_id", "conversations_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_503ad0ec123e2521d98d7eb4ec" ON "users_conversations_conversations" ("users_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b86a3f48efce78ef393f386424" ON "users_conversations_conversations" ("conversations_id") `);
        await queryRunner.query(`ALTER TABLE "users_conversations_conversations" ADD CONSTRAINT "FK_503ad0ec123e2521d98d7eb4eca" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_conversations_conversations" ADD CONSTRAINT "FK_b86a3f48efce78ef393f386424f" FOREIGN KEY ("conversations_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_conversations_conversations" DROP CONSTRAINT "FK_b86a3f48efce78ef393f386424f"`);
        await queryRunner.query(`ALTER TABLE "users_conversations_conversations" DROP CONSTRAINT "FK_503ad0ec123e2521d98d7eb4eca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b86a3f48efce78ef393f386424"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_503ad0ec123e2521d98d7eb4ec"`);
        await queryRunner.query(`DROP TABLE "users_conversations_conversations"`);
        await queryRunner.query(`DROP TABLE "conversations"`);
    }

}
