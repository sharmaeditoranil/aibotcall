import { TelephonyProvider } from './telephony.interface.js';
import { ExotelProvider } from './exotel.provider.js';
import { TwilioProvider } from './twilio.provider.js';

export * from './telephony.interface.js';
export * from './exotel.provider.js';
export * from './twilio.provider.js';

class ProviderRegistry {
  private providers: Map<string, TelephonyProvider> = new Map();

  constructor() {
    this.register(new ExotelProvider());
    this.register(new TwilioProvider());
  }

  register(provider: TelephonyProvider): void {
    this.providers.set(provider.name.toLowerCase(), provider);
  }

  get(name = 'exotel'): TelephonyProvider {
    const provider = this.providers.get(name.toLowerCase());
    if (!provider) {
      throw new Error(`Telephony provider '${name}' not found. Available: ${Array.from(this.providers.keys()).join(', ')}`);
    }
    return provider;
  }
}

export const providerRegistry = new ProviderRegistry();
