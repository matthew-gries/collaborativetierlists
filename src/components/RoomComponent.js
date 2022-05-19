import React, { useEffect } from "react";
import Parse from "parse";
import { useParseQuery } from "@parse/react";
import { useParams } from "react-router-dom";
import { TierComponent } from "./TierComponent";
import { Grid } from "@mui/material";
import { NewElementComponent } from "./NewElementComponent";
import { ElementContainerComponent } from "./ElementContainerComponent";

export const RoomComponent = () => {

  const { code } = useParams();

  const roomQuery = new Parse.Query("Room");
  roomQuery.contains("code", code);
  // Declare hook and variables to hold hook responses
  const { results } = useParseQuery(roomQuery, {
    enableLocalDatastore: true, // Enables cache in local datastore (default: true)
    enableLiveQuery: true, // Enables live query for real-time update (default: true)
  });

  useEffect(() => {
    const roomQuery = new Parse.Query("Room");
    roomQuery.contains("code", code);
    roomQuery.find()
      .then((results) => {
        const result = results[0];
        result.set("activeUsers", result.get("activeUsers") + 1);
        return result.save();
      }).then(() => {
        console.log("Active users updated!");
      }).catch((e) => {
        alert("Problem updating users: " + e);
      });

    const onRoomExit = () => {
      console.log("hi");
      const roomQuery = new Parse.Query("Room");
      roomQuery.contains("code", code);
      roomQuery.find()
        .then((results) => {
          const result = results[0];
          const users = result.get("activeUsers") - 1;
          if (users === 0) {
            return result.destroy();
          } else {
            result.set("activeUsers", result.get("activeUsers") - 1);
            return result.save();
          }
        }).then(() => {
          console.log("Active users updated!");
        }).catch((e) => {
          alert("Problem updating users: " + e);
        });
    }

    return onRoomExit;
  }, [code]);

  return (
    <div>
      {!results || !results[0] ? <p>Loading</p> : (() => {

        const result = results[0];
        const tiers = result.get('tiers');
        const images = result.get('images');
        const textElements = result.get('text');
        const elementTierMap = new Map(Object.entries(result.get('elementTierMap')));

        return (
          <div>
            <Grid
              container
              spacing={1}
              sx={{
                width: "100%",
                height: "100%",
              }}
            >
              {tiers.map((tier, i) => {
                  return (
                    <Grid container key={i}>
                      <Grid item xs={3}>
                        <TierComponent key={2*i} color={tier.color} tag={tier.tag} />
                      </Grid>
                      <Grid item key={2*i+1} xs={9}>
                        <ElementContainerComponent code={code} tag={tier.tag} images={images} textElements={textElements} elementTierMap={elementTierMap} />
                      </Grid>
                    </Grid>
                  );
              })}
            </Grid>
            <NewElementComponent code={code}/>
            <ElementContainerComponent code={code} tag={null} images={images} textElements={textElements} elementTierMap={elementTierMap} />
          </div>
        );
      })()}
    </div>
  );
}