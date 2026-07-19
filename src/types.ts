import { type Manifest as PolyFillManifest } from "webextension-polyfill";

type CommonDataCollectionPermission =
  | "authenticationInfo"
  | "bookmarksInfo"
  | "browsingActivity"
  | "financialAndPaymentInfo"
  | "healthInfo"
  | "locationInfo"
  | "personalCommunications"
  | "personallyIdentifyingInfo"
  | "searchTerms"
  | "websiteActivity"
  | "websiteContent";

type DataCollectionPermission = CommonDataCollectionPermission | "none";

type OptionalDataCollectionPermission =
  | CommonDataCollectionPermission
  | "technicalAndInteraction";

interface FirefoxSpecificPropertiesDataCollectionPermissionsType {
  required?: DataCollectionPermission[];
  optional?: OptionalDataCollectionPermission[];
  has_previous_consent?: boolean;
}

export type Manifest = PolyFillManifest.WebExtensionManifest & {
  browser_specific_settings?: {
    gecko?: {
      data_collection_permissions?: FirefoxSpecificPropertiesDataCollectionPermissionsType;
    };
  };
};
