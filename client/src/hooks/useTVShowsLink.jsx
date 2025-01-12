import React, { useEffect, useState } from "react";
import axios from "axios";
// import { networkIds } from '../utils/NetworkIDs/webSeriesNetworkId';
import { HindinetworkIds } from "../utils/NetworkIDs/HindiNetworkId";
function useTVShowsLink(networkIds, languageHindi, languagePunjabi) {
  // Default to an empty object for filterOptions
  const [tvShows, setTVShows] = useState([]); // For storing all TV shows
  const [newWebSeries, setNewWebSeries] = useState([]); // For storing newly released web series
  const [hindi, setHindi] = useState([]);
  const [punjabi, setPunjabi] = useState([]);
  const [loading, setLoading] = useState(false);
  const Hindi = HindinetworkIds.join(",");
// console.log("hin", Hindi);
  const apiKey = import.meta.env.VITE_TMDB_API;
  useEffect(() => {
    const fetchTVShows = async () => {
      const results = [];

      try {
        setLoading(true)
        for (const id of networkIds) {
          const response = await axios.get(
            `https://api.themoviedb.org/3/discover/tv`,
            {
              params: {
                api_key: `${apiKey}`,
                with_networks: id,
                sort_by: 'vote_count.desc',

                  //  "with_original_language": "hi"
              },
            }
          );
          results.push(...response.data.results); // Combine results
        }

        const uniqueResults = [
          ...new Map(results.map((item) => [item.id, item])).values(),
        ];
        console.log("unique", uniqueResults);
        setTVShows(uniqueResults); // Set fetched TV shows
        setLoading(false)
      } catch (error) {
        console.error("Error fetching TV shows:", error);
      }

      const results2 = [];
      try {
        setLoading(true);
        for (const id of networkIds) {
          const response = await axios.get(
            `https://api.themoviedb.org/3/discover/tv`,
            {
              params: {
                api_key: `${apiKey}`,
                // with_networks: id,
                "first_air_date.gte": "2024-10-01",
                "first_air_date.lte": new Date().toISOString().split("T")[0],
                 sort_by: 'vote_count.desc',
                // "vote_count.gte": 10,
                // page: 1
              },
            }
          );

          results2.push(...response.data.results); // Combine results
        }

        const uniqueResults2 = [
          ...new Map(results2.map((item) => [item.id, item])).values(),
        ];
        setNewWebSeries(uniqueResults2); // Set fetched TV shows
        setLoading(false)
      } catch (error) {
        console.error("Error fetching TV shows:", error);
      }

      const HindiResult=[]
      try {
        setLoading(true);
        for (const id of HindinetworkIds) {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/tv`,
          {
            params: {
              api_key: `${apiKey}`,
              // "first_air_date.gte": "2023-01-01",
              // "first_air_date.lte": new Date().toISOString().split('T')[0],
              "vote_count.gte": 10,
              with_networks: id,
              // with_original_language: "hi",
              // page: 1
            },
          }
        );
        
        HindiResult.push(...response.data.results); // Combine results
        }
        const HindiResults2 = [
          ...new Map(HindiResult.map((item) => [item.id, item])).values(),
        ];
        setHindi(HindiResults2); // Set fetched TV shows
        setLoading(false)
      } catch (error) {
        console.error("Error fetching TV shows:", error);
      }
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/tv`,
          {
            params: {
              api_key: `${apiKey}`,
              "first_air_date.gte": "2023-01-01",
              // "first_air_date.lte": new Date().toISOString().split('T')[0],
              // 'vote_count.gte': 10,
              with_original_language: "pa",
              // page: 1
            },
          }
        );

        setPunjabi(response.data.results); // Set fetched TV shows
        setLoading(false)
      } catch (error) {
        console.error("Error fetching TV shows:", error);
      }
    };

    fetchTVShows();
  }, []);

  return { tvShows, newWebSeries, hindi, punjabi,loading};
}

export default useTVShowsLink;
