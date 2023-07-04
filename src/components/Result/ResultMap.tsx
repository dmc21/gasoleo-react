import { useContext, useEffect, useRef, useState } from "react";
import { GasoleoContext } from "../../context/GasoleoContext";
import "./Result.css";
import maplibregl, { GeoJSONSource } from 'maplibre-gl'; // or "const maplibregl = require('maplibre-gl');"
import Map, {Layer, MapRef, Marker, NavigationControl, Source} from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from "./map/layers";
import { FeatureCollection } from "./map/featureCollection";

export default function ResultMap() {
  const { dataToShare, selectedOrderValue, loading } = useContext(GasoleoContext);
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

    dataToShare.map(el => {
      geojson.features.push(
        { 
        "type": "Feature", 
        "properties": { 
          "id": el.Dirección, 
          "price": el["Precio Gasoleo A"], 
        },
         "geometry": { 
          "type": "Point", 
          "coordinates": [ Number(el["Longitud (WGS84)"].replace(",", ".")), Number(el.Latitud.replace(",", ".")), 0.0 ] 
        } 
      },
      )
    })

  }, [dataToShare]);


  const onClick = (event: any) => {
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
  };

  if (loading)
    return (
      <section className="flex justify-content-center align-items-center">
          <div className="lds-ripple"><div></div><div></div></div>
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
          longitude: -3.713,
          latitude: 40.2085,
          zoom: 4
        }}
        interactiveLayerIds={[clusterLayer.id || '']}
        onClick={onClick}
        style={{width: "100%", height: " calc(100vh - 170px)"}}
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
