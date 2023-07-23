import { useContext, useEffect, useRef, useState } from "react";
import { GasoleoContext } from "../../context/GasoleoContext";
import "./Result.css";
import maplibregl, { GeoJSONSource, ImageSource } from 'maplibre-gl'; // or "const maplibregl = require('maplibre-gl');"
import Map, {Layer, MapRef, NavigationControl, Popup, Source} from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from "./map/layers";
import { FeatureCollection } from "./map/featureCollection";

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useMediaQuery } from "react-responsive";

export default function ResultMap() {
  const { dataToShare, loading, selectedOrderValue } = useContext(GasoleoContext);

  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });

  const validRefs = ['CEPSA', 'REPSOL', 'SHELL',
  'BP', 'PLENOIL', 'TOTAL', 'GALP', 'ALCAMPO', 'PETROPRIX']
  const mapRef = useRef<MapRef>(null);
  const geojson: FeatureCollection = {
    type: 'FeatureCollection',
    crs: {
      properties: {
        name: "Data by Town"
      },
      type: "name",
    },
    features: []
  }

  useEffect(() => {

    const str = Number(selectedOrderValue) === 0 ? 'Precio Gasoleo A' : Number(selectedOrderValue) === 1 ? 'Precio Gasoleo Premium' : Number(selectedOrderValue) === 2 ? 'Precio Gasolina 95 E5' : 'Precio Gasolina 95 E5 Premium'

    dataToShare.forEach(el => {
      geojson.features.push(
        { 
        "type": "Feature", 
        "properties": { 
          "id": el.Dirección, 
          "price": `${el.Rótulo}\n${el[str]}`, 
          "brand": getKeys(el.Rótulo),
        },
         "geometry": { 
          "type": "Point", 
          "coordinates": [ Number(el["Longitud (WGS84)"].replace(",", ".")), Number(el.Latitud.replace(",", ".")), 0.0 ] 
        } 
      },
      )
    })


  }, [dataToShare, geojson.features, selectedOrderValue]);

  const getKeys = (ref:string) => {

    if (validRefs.map(d => ref.includes(d)).some(d => d)) {
      let r = validRefs.find(d => ref.includes(d))
      return r
    }

    return 'marca-blanca'

  }


  const onClick = (event: any) => {
    if (event.features.length > 0) {
      const feature = event.features[0];
      const clusterId = feature.properties.cluster_id;
  
      const mapboxSource = mapRef?.current?.getSource('earthquakes') as GeoJSONSource;
  
      mapboxSource.getClusterExpansionZoom(clusterId, (err: any, zoom: any) => {
        if (err) {
          return;
        }
  
        mapRef?.current?.easeTo({
          center: feature.geometry.coordinates,
          zoom,
          duration: 500
        });
      });
    }

  };

  const onMapLoad = () => {

    validRefs.forEach(r => {
      loadImage(r)
    })

    loadImage('marca-blanca')

    mapRef.current?.on('click', 'unclustered-point', (event) => {

      if (event.features) {
        const asset = dataToShare.find(g => g.Dirección === (event.features?.at(0) as any).properties.id)
        console.log(asset)
      }
     
    })
   
  }

  const getMapCss = () => {
   return  isMobile ? 'calc(100vh - 263px)' : 'calc(100vh - 108px)'
  }

  const loadImage = (r: string) => {
    mapRef.current?.loadImage(
      `../images/${r}.png`,
      (error, image) => {
      if (error) throw error;
      mapRef.current?.addImage(r, image as any);
      })
  }

  if (loading)
    return (
      <section className="flex justify-content-center align-items-center w-full">
          <Skeleton width={'100%'} height={getMapCss()} count={1}></Skeleton>
      </section>
    )

  return (
    <>
    <section className="flex flex-col items-center gap-2 w-full">
      <section className="flex justify-content-between">
        <h1>Total: {dataToShare ? dataToShare.length : ""}</h1>
      </section>

      <Map mapLib={maplibregl as any} 
        ref={mapRef}
        initialViewState={{
          longitude: Number(dataToShare[0]["Longitud (WGS84)"].replace(',', ".")),
          latitude:  Number(dataToShare[0]["Latitud"].replace(',', ".")),
          zoom: 7
        }}
        interactiveLayerIds={[clusterLayer.id || '']}
        onClick={onClick}
        onLoad={onMapLoad}
        style={{width: "100%", height: getMapCss()}}
        mapStyle="https://api.maptiler.com/maps/basic-v2/style.json?key=UgUlr4edjFU7NcebSHgN"
      >

        <Source
          id="earthquakes"
          type="geojson"
          data={geojson}
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
         

          </Source>

        <NavigationControl position="top-left" />
      </Map>

    </section>

    </>
  );
}
