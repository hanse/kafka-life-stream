export type Account = {
  accountId: string;
  accountNumber: string;
  accountType: string;
  name: string;
  ownerCustomerId: string;
  available: number;
  balance: number;
  creditLimit: number;
};

export type Address = {
  addressLine1: string | null;
  addressLine2: string | null;
  addressLine3: string | null;
  addressLine4: string | null;
  country: string | null;
  zipCode: string | null;
  city: string | null;
};

export type Customer = {
  customerId: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  dateOfBirth: string;
  postalAddress: Address;
  streetAdress: Address;
  phoneNumbers: Array<{ countryCode: string; number: string }>;
};

export type Transfer = {
  fromAccountId: string;
  toAccountId: string;
  message: string;
  amount: number;
};
