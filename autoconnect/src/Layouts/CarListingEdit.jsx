import React from "react";
import { useParams } from "react-router-dom";
import CarListingCreation from "./CarListingCreation";

const CarListingEdit = () => {
  const { listingId } = useParams();

  return <CarListingCreation listingId={listingId} />;
};

export default CarListingEdit;
