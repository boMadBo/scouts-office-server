import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserAvatar1710154706669 implements MigrationInterface {
    name = 'addUserAvatar1710154706669'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "avatar_url" TO "avatar"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar" bytea`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar" character varying`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "avatar" TO "avatar_url"`);
    }

}
