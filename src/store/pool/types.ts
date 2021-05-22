// This file holds our state type, as well as any other types related to this Redux store.

// Response object for GET /heroes
// https://docs.opendota.com/#tag/heroes%2Fpaths%2F~1heroes%2Fget
export interface Pool extends ApiResponse {
  id: number
  name: string
  localized_name: string
  primary_attr: string
  attack_type: string
  roles: string[]
  img: string
  icon: string
  base_health: number
  base_health_regen: number
  base_mana: number
  base_mana_regen: number
  base_armor: number
  base_mr: number
  base_attack_min: number
  base_attack_max: number
  base_str: number
  base_agi: number
  base_int: number
  str_gain: number
  agi_gain: number
  int_gain: number
  attack_range: number
  projectile_speed: number
  attack_rate: number
  move_speed: number
  turn_rate: number
  cm_enabled: boolean
  legs: number
}

// This type is basically shorthand for `{ [key: string]: any }`. Feel free to replace `any` with
// the expected return type of your API response.
export type ApiResponse = Record<string, any>

// Use `enum`s for better autocompletion of action type names. These will
// be compiled away leaving only the final value in your compiled code.
//
// Define however naming conventions you'd like for your action types, but
// personally, I use the `@@context/ACTION_TYPE` convention, to follow the convention
// of Redux's `@@INIT` action.
export enum PoolActionTypes {
  FETCH_REQUEST = '@@pool/FETCH_REQUEST',
  FETCH_SUCCESS = '@@pool/FETCH_SUCCESS',
  FETCH_ERROR = '@@pool/FETCH_ERROR',
  SELECT_HERO = '@@pool/SELECT_HERO',
  SELECTED = '@@pool/SELECTED'
}

// Declare state types with `readonly` modifier to get compile time immutability.
// https://github.com/piotrwitek/react-redux-typescript-guide#state-with-type-level-immutability
export interface PoolState {
  readonly loading: boolean
  readonly data: Pool[]
  readonly errors?: string
}
