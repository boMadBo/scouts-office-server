import {MigrationInterface, QueryRunner} from "typeorm";

export class addUser1709828034918 implements MigrationInterface {
    name = 'addUser1709828034918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "country" character varying NOT NULL, "birth_date" TIMESTAMP NOT NULL, "avatar_url" character varying, "token" character varying, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
