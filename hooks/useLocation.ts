import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { LOCATION_CHANGE_LISTENER_THRESHOLD_METERS } from "../constants";
import { setMyLocation } from "../redux/features/users/usersSlice";
import { useAppDispatch } from "../redux/hooks";

export const useLocation = () => {
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState(Location.PermissionStatus.UNDETERMINED);
  const fetchLocation = useCallback(async () => {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low, // see https://github.com/expo/expo/issues/10756#issuecomment-728382658
    });
    const { latitude, longitude } = location.coords;
    dispatch(setMyLocation({ latitude, longitude }));
    Location.watchPositionAsync(
      { distanceInterval: LOCATION_CHANGE_LISTENER_THRESHOLD_METERS },
      (location) => {
        const { latitude, longitude } = location.coords;
        dispatch(setMyLocation({ latitude, longitude }));
      }
    );
  }, [dispatch]);
  const requestLocation = useCallback(async () => {
    const { status: localStatus } = await Location.requestForegroundPermissionsAsync();
    if (localStatus === "denied") {
      //TODO: need to ask to enable location/Location services in settings. [iOS]
    }
    setStatus(localStatus);
    if (localStatus !== "granted") return;
    await fetchLocation();
  }, [fetchLocation]);
  useEffect(() => {
    (async () => {
      const localStatus = await Location.getForegroundPermissionsAsync();
      setStatus(localStatus.status);
    })();
  }, []);

  return {
    locationStatus: status,
    requestLocation,
    fetchLocation,
  };
};
