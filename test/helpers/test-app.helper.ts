import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';
import { AppModule } from 'src/app.module';
import { UserModel } from 'src/modules/users/infrastructure/sequelize/user.model';
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter';

export interface TestAppContext {
  app: INestApplication;
  sequelize: Sequelize;
  userModel: typeof UserModel;
}

//Initialize a test aplication with Sequelize test DB
export async function initTestApp(): Promise<TestAppContext> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  //get sequelize instance from Nest container
  const sequelize = moduleFixture.get<Sequelize>(Sequelize);

  //reset DB (drop and recreate tables)
  await sequelize.drop();
  await sequelize.sync({ force: true });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();

  return { app, sequelize, userModel: UserModel };
}

//close test application and DB connections
export async function closeTestApp(context: TestAppContext): Promise<void> {
  const { app, sequelize } = context;
  //se podria agregar .destroy para borrar la tabla en cuestion (al prox test con beforeAll ya se limpia todo)
  await sequelize.close();
  await app.close();
}

//reset DB state between tests
export async function resetTestApp(context: TestAppContext): Promise<void> {
  const { sequelize } = context;

  //drops and recreat all tables
  await sequelize.sync({ force: true });
}
