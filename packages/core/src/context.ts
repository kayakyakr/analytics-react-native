import { libraryInfo } from './info';

import type {
  Config,
  Context,
  ContextDevice,
  GetContextConfig,
  NativeContextInfo,
  UserTraits,
} from './types';
import { getNativeModule } from './util';
import { getUUID } from './uuid';
import type { AnalyticsReactNativeModule } from './types';

const defaultContext = {
  appName: '',
  appVersion: '',
  buildNumber: '',
  bundleId: '',
  locale: '',
  networkType: '',
  osName: '',
  osVersion: '',
  screenHeight: 0,
  screenWidth: 0,
  timezone: '',
  manufacturer: '',
  model: '',
  deviceName: '',
  deviceId: '',
  deviceType: '',
  screenDensity: 0,
};

export const getContext = async (
  userTraits: UserTraits = {},
  config?: Config
): Promise<Context> => {
  // We need to remove all stuff from the config that is not actually required by the native module
  const nativeConfig: GetContextConfig = {
    collectDeviceId: config?.collectDeviceId ?? false,
  };

  const nativeModule = getNativeModule(
    'AnalyticsReactNative'
  ) as AnalyticsReactNativeModule;

  const {
    appName,
    appVersion,
    buildNumber,
    bundleId,
    locale,
    networkType,
    osName,
    osVersion,
    screenHeight,
    screenWidth,
    timezone,
    manufacturer,
    model,
    deviceName,
    deviceId,
    deviceType,
    screenDensity,
  }: NativeContextInfo =
    (await nativeModule.getContextInfo(nativeConfig)) ?? defaultContext;

  const device: ContextDevice = {
    id: deviceId,
    manufacturer: manufacturer,
    model: model,
    name: deviceName,
    type: deviceType,
  };

  return {
    app: {
      build: buildNumber,
      name: appName,
      namespace: bundleId,
      version: appVersion,
    },
    device,
    library: {
      name: 'analytics-react-native',
      version: libraryInfo.version,
    },
    locale,
    network: {
      cellular: networkType === 'cellular',
      wifi: networkType === 'wifi',
    },
    os: {
      name: osName,
      version: osVersion,
    },
    screen: {
      width: screenWidth,
      height: screenHeight,
      density: screenDensity,
    },
    timezone,
    traits: userTraits,
    instanceId: getUUID(),
  };
};
