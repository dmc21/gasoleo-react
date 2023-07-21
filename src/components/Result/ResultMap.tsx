import { useContext, useEffect, useRef } from "react";
import { GasoleoContext } from "../../context/GasoleoContext";
import "./Result.css";
import maplibregl, { GeoJSONSource, ImageSource } from 'maplibre-gl'; // or "const maplibregl = require('maplibre-gl');"
import Map, {Layer, MapRef, NavigationControl, Source} from 'react-map-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from "./map/layers";
import { FeatureCollection } from "./map/featureCollection";

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import image from '../../images/gasoleo_resize.png';

export default function ResultMap() {
  const { dataToShare, loading, selectedOrderValue, toggleLoading } = useContext(GasoleoContext);
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
          "price": el[str], 
        },
         "geometry": { 
          "type": "Point", 
          "coordinates": [ Number(el["Longitud (WGS84)"].replace(",", ".")), Number(el.Latitud.replace(",", ".")), 0.0 ] 
        } 
      },
      )
    })


  }, [dataToShare, geojson.features, selectedOrderValue]);


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

  const onMapLoad = () => {
    mapRef.current?.loadImage(
      image,
      (error, image) => {
      if (error) throw error;
      console.log('adding image')
      mapRef.current?.addImage('custom-marker', image as any);
      })
  }

  if (loading)
    return (
      <section className="flex justify-content-center align-items-center w-full">
          <Skeleton width={'100%'} height={'calc(100vh - 170px)'} count={1}></Skeleton>
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
