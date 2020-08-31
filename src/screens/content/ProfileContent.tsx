import React from 'react';
import { StyleSheet, ScrollView, View, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import moment from 'moment';
import Constants from 'expo-constants';
import { useIsFocused, NavigationProp } from '@react-navigation/native';

import { hapticImpact } from '@services/hapticService';
import { TRedux } from '@reducers';
import { _auth, _kappa } from '@reducers/actions';
import { theme } from '@constants';
import { TPoints, POINTS_SO, GM_SO, POINTS_JR, GM_JR, POINTS_SR, GM_SR } from '@constants/Points';
import { Block, Text, Icon, GeneralMeetingChart } from '@components';
import { prettyPhone, shouldLoad, sortEventsByDateReverse } from '@services/kappaService';
import { isEmpty, HORIZONTAL_PADDING } from '@services/utils';
import { log } from '@services/logService';
import { TEvent } from '@backend/kappa';

const ProfileContent: React.FC<{
  navigation: NavigationProp<any, 'Profile'>;
}> = ({ navigation }) => {
  const isFocused = useIsFocused();

  const user = useSelector((state: TRedux) => state.auth.user);
  const loadHistory = useSelector((state: TRedux) => state.kappa.loadHistory);
  const events = useSelector((state: TRedux) => state.kappa.events);
  const isGettingEvents = useSelector((state: TRedux) => state.kappa.isGettingEvents);
  const getEventsError = useSelector((state: TRedux) => state.kappa.getEventsError);
  const gmCount = useSelector((state: TRedux) => state.kappa.gmCount);
  const records = useSelector((state: TRedux) => state.kappa.records);
  const isGettingAttendance = useSelector((state: TRedux) => state.kappa.isGettingAttendance);
  const getAttendanceError = useSelector((state: TRedux) => state.kappa.getAttendanceError);
  const missedMandatory = useSelector((state: TRedux) => state.kappa.missedMandatory);
  const points = useSelector((state: TRedux) => state.kappa.points);
  const isGettingPoints = useSelector((state: TRedux) => state.kappa.isGettingPoints);
  const getPointsError = useSelector((state: TRedux) => state.kappa.getPointsError);
  const isGettingDirectory = useSelector((state: TRedux) => state.kappa.isGettingDirectory);
  const getDirectoryError = useSelector((state: TRedux) => state.kappa.getDirectoryError);

  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const dispatch = useDispatch();
  const dispatchEditUser = React.useCallback(() => dispatch(_kappa.editUser(user.email)), [dispatch, user.email]);
  const dispatchSignOut = React.useCallback(() => dispatch(_auth.signOut()), [dispatch]);
  const dispatchGetEvents = React.useCallback(() => dispatch(_kappa.getEvents(user)), [dispatch, user]);
  const dispatchGetMyAttendance = React.useCallback(
    (overwrite: boolean = false) => dispatch(_kappa.getMyAttendance(user, overwrite)),
    [dispatch, user]
  );
  const dispatchGetPoints = React.useCallback(() => dispatch(_kappa.getPointsByUser(user, user.email)), [
    dispatch,
    user
  ]);
  const dispatchGetDirectory = React.useCallback(() => dispatch(_kappa.getDirectory(user)), [dispatch, user]);

  const insets = useSafeArea();

  const loadData = React.useCallback(
    (force: boolean) => {
      if (!isGettingEvents && (force || (!getEventsError && shouldLoad(loadHistory, 'events')))) dispatchGetEvents();
      if (!isGettingDirectory && (force || (!getDirectoryError && shouldLoad(loadHistory, 'directory'))))
        dispatchGetDirectory();
      if (!isGettingAttendance && (force || (!getAttendanceError && shouldLoad(loadHistory, `user-${user.email}`))))
        dispatchGetMyAttendance(force);
      if (!isGettingPoints && (force || (!getPointsError && shouldLoad(loadHistory, `points-${user.email}`))))
        dispatchGetPoints();
    },
    [
      isGettingEvents,
      getEventsError,
      loadHistory,
      dispatchGetEvents,
      isGettingDirectory,
      getDirectoryError,
      dispatchGetDirectory,
      isGettingAttendance,
      getAttendanceError,
      user.email,
      dispatchGetMyAttendance,
      isGettingPoints,
      getPointsError,
      dispatchGetPoints
    ]
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    loadData(true);
  }, [loadData]);

  const onPressEdit = React.useCallback(() => {
    hapticImpact();

    dispatchEditUser();
  }, [dispatchEditUser]);

  const onPressSignOut = React.useCallback(() => {
    hapticImpact();

    dispatchSignOut();
  }, [dispatchSignOut]);

  const mandatory = React.useMemo(() => {
    if (!user.privileged) return [];

    if (isEmpty(missedMandatory[user.email])) return [];

    return Object.values(missedMandatory[user.email]).sort(sortEventsByDateReverse);
  }, [user, missedMandatory]);

  React.useEffect(() => {
    if (!isGettingEvents && !isGettingAttendance && !isGettingPoints) {
      setRefreshing(false);
    }
  }, [isGettingEvents, isGettingAttendance, isGettingPoints]);

  React.useEffect(() => {
    if (isFocused && user.sessionToken) {
      loadData(false);
    }
  }, [isFocused, loadData, user.sessionToken]);

  const renderRequirements = (points: TPoints, gm: number) => {
    return (
      <View style={styles.splitPropertyRow}>
        <View style={styles.splitPropertyFifths}>
          <Text style={styles.propertyHeader}>Prof</Text>
          <Text style={styles.propertyValue}>{points.PROF}</Text>
        </View>
        <View style={styles.splitPropertyFifths}>
          <Text style={styles.propertyHeader}>Phil</Text>
          <Text style={styles.propertyValue}>{points.PHIL}</Text>
        </View>
        <View style={styles.splitPropertyFifths}>
          <Text style={styles.propertyHeader}>Bro</Text>
          <Text style={styles.propertyValue}>{points.BRO}</Text>
        </View>
        <View style={styles.splitPropertyFifths}>
          <Text style={styles.propertyHeader}>Rush</Text>
          <Text style={styles.propertyValue}>{points.RUSH}</Text>
        </View>

        <View style={styles.splitPropertyFifths}>
          <Text style={styles.propertyHeader}>GM</Text>
          <Text style={styles.propertyValue}>{gm}%</Text>
        </View>
      </View>
    );
  };

  return (
    <Block flex>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Block
          style={[
            styles.content,
            {
              paddingTop: insets.top > 0 ? insets.top + 10 : 20
            }
          ]}
        >
          <Block style={styles.header}>
            <Block style={styles.headerTextWrapper}>
              <Text style={styles.title}>Hi {user.givenName}</Text>
              <Text style={styles.subtitle}>{user.role}</Text>
            </Block>

            <Block style={styles.headerButtons}>
              <TouchableOpacity onPress={onPressEdit}>
                <Icon style={styles.headerButton} family="MaterialIcons" name="edit" size={24} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onPressSignOut}>
                <Icon style={styles.headerButtonEnd} family="MaterialIcons" name="lock-outline" size={24} />
              </TouchableOpacity>
            </Block>
          </Block>

          <Block>
            <Block style={styles.splitPropertyRow}>
              <Block style={styles.splitPropertyAuto}>
                <Text style={styles.propertyHeader}>First Year</Text>
                <Text style={styles.propertyValue}>{user.firstYear}</Text>
              </Block>
              <Block style={styles.splitPropertyAuto}>
                <Text style={styles.propertyHeader}>Grad Year</Text>
                <Text style={styles.propertyValue}>{user.gradYear}</Text>
              </Block>
              <Block style={styles.splitPropertyAuto}>
                <Text style={styles.propertyHeader}>Pledge Class</Text>
                <Text style={styles.propertyValue}>{user.semester}</Text>
              </Block>
            </Block>
            <Block style={styles.splitPropertyRow}>
              <Block style={styles.splitPropertyAuto}>
                <Text style={styles.propertyHeader}>Email</Text>
                <Text style={styles.propertyValue}>{user.email}</Text>
              </Block>
              <Block style={styles.splitPropertyAuto}>
                <Text style={styles.propertyHeader}>Phone</Text>
                <Text style={styles.propertyValue}>{prettyPhone(user.phone)}</Text>
              </Block>
            </Block>
          </Block>

          <Text style={styles.pointsText}>Points</Text>
          <Block>
            <Block style={styles.splitPropertyRow}>
              <Block style={styles.splitPropertyFifths}>
                <Text style={styles.propertyHeader}>Prof</Text>
                {isGettingPoints ? (
                  <ActivityIndicator style={styles.propertyLoader} color={theme.COLORS.DARK_GRAY} />
                ) : (
                  <Text style={styles.propertyValue}>
                    {points.hasOwnProperty(user.email) ? points[user.email].PROF : '0'}
                  </Text>
                )}
              </Block>
              <Block style={styles.splitPropertyFifths}>
                <Text style={styles.propertyHeader}>Phil</Text>
                {isGettingPoints ? (
                  <ActivityIndicator style={styles.propertyLoader} color={theme.COLORS.DARK_GRAY} />
                ) : (
                  <Text style={styles.propertyValue}>
                    {points.hasOwnProperty(user.email) ? points[user.email].PHIL : '0'}
                  </Text>
                )}
              </Block>
              <Block style={styles.splitPropertyFifths}>
                <Text style={styles.propertyHeader}>Bro</Text>
                {isGettingPoints ? (
                  <ActivityIndicator style={styles.propertyLoader} color={theme.COLORS.DARK_GRAY} />
                ) : (
                  <Text style={styles.propertyValue}>
                    {points.hasOwnProperty(user.email) ? points[user.email].BRO : '0'}
                  </Text>
                )}
              </Block>
              <Block style={styles.splitPropertyFifths}>
                <Text style={styles.propertyHeader}>Rush</Text>
                {isGettingPoints ? (
                  <ActivityIndicator style={styles.propertyLoader} color={theme.COLORS.DARK_GRAY} />
                ) : (
                  <Text style={styles.propertyValue}>
                    {points.hasOwnProperty(user.email) ? points[user.email].RUSH : '0'}
                  </Text>
                )}
              </Block>
              <Block style={styles.splitPropertyFifths}>
                <Text style={styles.propertyHeader}>Any</Text>
                {isGettingPoints ? (
                  <ActivityIndicator style={styles.propertyLoader} color={theme.COLORS.DARK_GRAY} />
                ) : (
                  <Text style={styles.propertyValue}>
                    {points.hasOwnProperty(user.email) ? points[user.email].ANY : '0'}
                  </Text>
                )}
              </Block>
            </Block>
          </Block>

          <Block style={styles.adminContainer}>
            <GeneralMeetingChart
              isGettingAttendance={isGettingAttendance}
              email={user.email}
              records={records}
              events={events}
              gmCount={gmCount}
            />

            <Block style={styles.eventList}>
              {mandatory.length > 0 && (
                <React.Fragment>
                  <Text style={styles.mandatoryLabel}>Missed Mandatory</Text>
                  {mandatory.map((event: TEvent) => (
                    <Block key={event._id} style={styles.eventContainer}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <Text style={styles.eventDate}>{moment(event.start).format('M/D/Y')}</Text>
                    </Block>
                  ))}
                </React.Fragment>
              )}
            </Block>
          </Block>

          <Text style={styles.headingText}>Requirements</Text>

          <Text style={styles.subHeadingText}>Sophomore</Text>

          {renderRequirements(POINTS_SO, GM_SO)}

          <Text style={styles.subHeadingText}>Junior</Text>

          {renderRequirements(POINTS_JR, GM_JR)}

          <Text style={styles.subHeadingText}>Senior</Text>

          {renderRequirements(POINTS_SR, GM_SR)}

          <Text style={styles.madeWithText}>
            {`Whatsoever thy hand findeth to do, do it with thy might.\n\n${Constants.nativeBuildVersion} - ${Constants.manifest.sdkVersion} - ${Constants.manifest.revisionId}\n\nJTC - Web Chair 2019-2021`}
          </Text>
        </Block>
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({
  content: {
    minHeight: '100%',
    paddingHorizontal: HORIZONTAL_PADDING
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerTextWrapper: {},
  title: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 24
  },
  subtitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 13,
    color: theme.COLORS.GRAY,
    textTransform: 'uppercase'
  },
  headerButtons: {
    paddingTop: 6,
    flexDirection: 'row'
  },
  headerButton: {
    paddingHorizontal: 4
  },
  headerButtonEnd: {
    marginLeft: 8
  },
  propertyHeader: {
    marginTop: 16,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 13,
    textTransform: 'uppercase',
    color: theme.COLORS.GRAY
  },
  propertyValue: {
    marginTop: 4,
    fontFamily: 'OpenSans',
    fontSize: 15
  },
  propertyLoader: {
    alignSelf: 'flex-start'
  },
  splitPropertyRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  splitPropertyAuto: {
    marginRight: 20
  },
  splitProperty: {
    width: '50%'
  },
  splitPropertyThirds: {
    width: '33%'
  },
  splitPropertyFifths: {
    width: '20%'
  },
  pointsText: {
    marginTop: 20,
    fontFamily: 'OpenSans-Bold',
    fontSize: 24,
    marginBottom: -8
  },
  adminContainer: {},
  mandatoryLabel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
    color: theme.COLORS.PRIMARY,
    textTransform: 'uppercase'
  },
  eventList: {},
  eventContainer: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.LIGHT_BORDER,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  eventTitle: {
    fontFamily: 'OpenSans',
    fontSize: 16
  },
  eventDate: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 13,
    color: theme.COLORS.GRAY,
    textTransform: 'uppercase'
  },
  madeWithText: {
    marginTop: 32,
    marginBottom: 8,
    fontFamily: 'OpenSans',
    fontSize: 12,
    color: theme.COLORS.BORDER,
    textAlign: 'center'
  },
  headingText: {
    marginTop: 24,
    marginBottom: 8,
    fontFamily: 'OpenSans-Bold',
    fontSize: 20
  },
  subHeadingText: {
    marginTop: 8,
    marginBottom: -8,
    fontFamily: 'OpenSans-Bold',
    fontSize: 14
  }
});

export default ProfileContent;
