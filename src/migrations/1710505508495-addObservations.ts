import {MigrationInterface, QueryRunner} from "typeorm";

export class addObservations1710505508495 implements MigrationInterface {
    name = 'addObservations1710505508495'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "observations" jsonb NOT NULL DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "observations"`);
    }

}
