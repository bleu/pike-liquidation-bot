import { Container } from 'inversify';
import { PriceService, PriceServiceMain, priceServiceSymbol } from './services/oracle';

function getApiContainer(): Container {
  const apiContainer = new Container();

  // Services
  apiContainer.bind<PriceService>(priceServiceSymbol).to(PriceServiceMain).inSingletonScope();

  return apiContainer;
}

export const apiContainer = getApiContainer();
