export interface Address {
  address: string;
}
export interface SettingType {
  headStuff: string;
  cssPreprocessor: 'css' | 'scss';
  cssCDN: Address[];
  jsCDN: Address[];
}