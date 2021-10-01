import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class alterTableStatementsAddColumnSenderId1633084013813
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "statements",
      new TableColumn({
        name: "sender_id",
        type: "uuid",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "statements",
      new TableForeignKey({
        columnNames: ["sender_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        name: "FK_STATEMENTS_USERS_SENDER_ID",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("statements", "sender_id");
    await queryRunner.dropForeignKey(
      "statements",
      "FK_STATEMENTS_USERS_SENDER_ID"
    );
  }
}
