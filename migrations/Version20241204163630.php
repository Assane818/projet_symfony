<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241204163630 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP SEQUENCE messenger_messages_id_seq CASCADE');
        $this->addSql('DROP TABLE messenger_messages');
        $this->addSql('CREATE SEQUENCE article_id_seq');
        $this->addSql('SELECT setval(\'article_id_seq\', (SELECT MAX(id) FROM article))');
        $this->addSql('ALTER TABLE article ALTER id SET DEFAULT nextval(\'article_id_seq\')');
        $this->addSql('ALTER TABLE client ADD users_id INT DEFAULT NULL');
        $this->addSql('CREATE SEQUENCE client_id_seq');
        $this->addSql('SELECT setval(\'client_id_seq\', (SELECT MAX(id) FROM client))');
        $this->addSql('ALTER TABLE client ALTER id SET DEFAULT nextval(\'client_id_seq\')');
        $this->addSql('ALTER TABLE client ADD CONSTRAINT FK_C744045567B3B43D FOREIGN KEY (users_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_C744045567B3B43D ON client (users_id)');
        $this->addSql('CREATE SEQUENCE detail_id_seq');
        $this->addSql('SELECT setval(\'detail_id_seq\', (SELECT MAX(id) FROM detail))');
        $this->addSql('ALTER TABLE detail ALTER id SET DEFAULT nextval(\'detail_id_seq\')');
        $this->addSql('CREATE SEQUENCE dette_id_seq');
        $this->addSql('SELECT setval(\'dette_id_seq\', (SELECT MAX(id) FROM dette))');
        $this->addSql('ALTER TABLE dette ALTER id SET DEFAULT nextval(\'dette_id_seq\')');
        $this->addSql('ALTER TABLE payement ADD create_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('ALTER TABLE payement ADD update_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('CREATE SEQUENCE payement_id_seq');
        $this->addSql('SELECT setval(\'payement_id_seq\', (SELECT MAX(id) FROM payement))');
        $this->addSql('ALTER TABLE payement ALTER id SET DEFAULT nextval(\'payement_id_seq\')');
        $this->addSql('COMMENT ON COLUMN payement.create_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT fk_8d93d64919eb6921');
        $this->addSql('DROP INDEX uniq_8d93d64919eb6921');
        $this->addSql('ALTER TABLE "user" DROP client_id');
        $this->addSql('CREATE SEQUENCE user_id_seq');
        $this->addSql('SELECT setval(\'user_id_seq\', (SELECT MAX(id) FROM "user"))');
        $this->addSql('ALTER TABLE "user" ALTER id SET DEFAULT nextval(\'user_id_seq\')');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('CREATE SEQUENCE messenger_messages_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE messenger_messages (id BIGSERIAL NOT NULL, body TEXT NOT NULL, headers TEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, available_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, delivered_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX idx_75ea56e016ba31db ON messenger_messages (delivered_at)');
        $this->addSql('CREATE INDEX idx_75ea56e0e3bd61ce ON messenger_messages (available_at)');
        $this->addSql('CREATE INDEX idx_75ea56e0fb7336f0 ON messenger_messages (queue_name)');
        $this->addSql('COMMENT ON COLUMN messenger_messages.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN messenger_messages.available_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN messenger_messages.delivered_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE payement DROP create_at');
        $this->addSql('ALTER TABLE payement DROP update_at');
        $this->addSql('ALTER TABLE payement ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE dette ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE detail ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE "user" ADD client_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE "user" ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE "user" ADD CONSTRAINT fk_8d93d64919eb6921 FOREIGN KEY (client_id) REFERENCES client (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX uniq_8d93d64919eb6921 ON "user" (client_id)');
        $this->addSql('ALTER TABLE client DROP CONSTRAINT FK_C744045567B3B43D');
        $this->addSql('DROP INDEX UNIQ_C744045567B3B43D');
        $this->addSql('ALTER TABLE client DROP users_id');
        $this->addSql('ALTER TABLE client ALTER id DROP DEFAULT');
        $this->addSql('ALTER TABLE article ALTER id DROP DEFAULT');
    }
}
