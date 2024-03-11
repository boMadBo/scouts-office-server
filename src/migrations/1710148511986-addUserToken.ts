import {MigrationInterface, QueryRunner} from "typeorm";

export class addUserToken1710148511986 implements MigrationInterface {
    name = 'addUserToken1710148511986'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "token_expired_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "refresh_token" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "refresh_token_expired_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refresh_token_expired_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refresh_token"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "token_expired_at"`);
    }

}
