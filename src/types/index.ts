export type HubSpotData = {
  next?: string;
  results?: {
    hs: { id: string; createdAt: Date; updatedAt: Date };
    archived?: boolean;
    createdAt: Date;
    updatedAt: Date;
    domain?: string;
    name: string;
  }[];
};

export type Company = {
  name: string;
  domain?: string;
  hs: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
  };
  archived: boolean;
  updatedAt: Date;
  createdAt: Date;
};
