import * as hubspot from '@hubspot/api-client';

class HubSpotSdk {
  private static instance: HubSpotSdk;
  private hubSpotClient: hubspot.Client;

  constructor() {
    this.hubSpotClient = new hubspot.Client({
      accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
    });
  }

  static getInstances() {
    if (HubSpotSdk.instance) return HubSpotSdk.instance;
    HubSpotSdk.instance = new HubSpotSdk();
    return HubSpotSdk.instance;
  }

  getAllCompanies() {
    return this.hubSpotClient.crm.companies.getAll(100);
  }
}
