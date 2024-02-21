import * as hubspot from '@hubspot/api-client';

export class HubSpotSdk {
  private static instance: HubSpotSdk;
  private readonly hubSpotClient: hubspot.Client;

  constructor() {
    this.hubSpotClient = new hubspot.Client({
      accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
    });
  }

  static getInstance() {
    if (HubSpotSdk.instance) return HubSpotSdk.instance;
    HubSpotSdk.instance = new HubSpotSdk();
    console.log('HubSpotSdk initialized');
    return HubSpotSdk.instance;
  }

  async getAllCompanies(args: {
    limit?: number;
    after?: string;
    properties?: string[];
    propertiesWithHistory?: string[];
    associations?: string[];
    archived?: boolean;
  }) {
    return await this.hubSpotClient.crm.companies.basicApi.getPage(
      args.limit,
      args.after,
      args.properties,
      args.propertiesWithHistory,
      args.associations,
      args.archived
    );
  }
}
