export interface FeatureCollection {
    type: 'FeatureCollection'
    crs: Crs
    features: Feature[]
  }
  
  export interface Crs {
    type: string
    properties: Properties
  }
  
  export interface Properties {
    name: string
  }
  
  export interface Feature {
    type: string
    properties: any
    geometry: Geometry
  }
  
  export interface Geometry {
    type: string
    coordinates: number[]
  }
  