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

  getAllCompanies(args: {
    limit?: number;
    after?: string;
    properties?: string[];
    propertiesWithHistory?: string[];
    associations?: string[];
    archived?: boolean;
  }) {
    return this.hubSpotClient.crm.companies.getAll(
      args.limit,
      args.after,
      args.properties,
      args.propertiesWithHistory,
      args.associations,
      args.archived
    );
  }
}
