import { useEffect } from "react";

const Catalog = ({ selectedFilters }) => {
  useEffect(() => {
    const {
      makes,
      bodies,
      transmissions,
      tractions,
      fuels,
      colors,
      priceRange = [0, 100000],
      kmRange = [0, 500000],
      yearRange = [2005, new Date().getFullYear()],
    } = selectedFilters;

    const queryParams = new URLSearchParams({
      makes: makes ? makes : "",
      bodies: bodies ? bodies : "",
      transmissions: transmissions ? transmissions : "",
      tractions: tractions ? tractions : "",
      fuels: fuels ? fuels : "",
      colors: colors ? colors : "",
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      kmMin: kmRange[0],
      kmMax: kmRange[1],
      yearMin: yearRange[0],
      yearMax: yearRange[1],
    }).toString();

    const fetchQuery = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/cars/?${queryParams}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch filter data");

        const data = await response.json();
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchQuery();
  }, [selectedFilters]);
};

export default Catalog;
