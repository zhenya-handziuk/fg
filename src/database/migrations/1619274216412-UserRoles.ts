import { MigrationInterface, QueryRunner } from 'typeorm';
import { Service } from 'typedi';

@Service()
export class UserRoles1619274216412 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_role" ("userId" integer NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_576c9f3d4bde478c9251555ba711e4ff" PRIMARY KEY ("userId", "roleId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ab3f32faf4f94817b15be1f4591f901a" ON "user_role" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4c3b63f231174e25b62538cce8677b5a" ON "user_role" ("roleId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD CONSTRAINT "FK_8d702ec4077244f8b636d3128dfb1d6b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD CONSTRAINT "FK_c7f550b7754148e3aae99600337891ce" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_role" DROP CONSTRAINT "FK_8d702ec4077244f8b636d3128dfb1d6b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" DROP CONSTRAINT "FK_c7f550b7754148e3aae99600337891ce"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_ab3f32faf4f94817b15be1f4591f901a"`);
    await queryRunner.query(`DROP INDEX "IDX_4c3b63f231174e25b62538cce8677b5a"`);
    await queryRunner.query(`DROP TABLE "user_role"`);
  }
}
