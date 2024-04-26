import { useParams } from "react-router-dom";

const Listings = () => {
  const { query } = useParams();

  return (
    <>
      <div>Listings</div>
      {query && <div>Search: {query}</div>}
    </>
  );
};

export default Listings;
