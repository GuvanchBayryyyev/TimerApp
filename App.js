
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    FlatList,
    TouchableOpacity,
    TextInput
} from 'react-native';

import {
    Colors,
} from 'react-native/Libraries/NewAppScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Stopwatch } from 'react-native-stopwatch-timer'

const App = () => {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const [timers, setTimers] = React.useState([
        {
            title: 'First',
            project: 'Project',
            action: false,
            currentTime: ''
        },
        {
            title: 'Second',
            project: 'Project Second',
            action: false,
            currentTime: ''
        }
    ])

    const [updating, setUpdating] = React.useState(-1)
    const [itemUpdating, setItemUpdating] = React.useState({
        title: '',
        project: ''
    })

    const RenderDeleteIcon = (info) => {
        return <Icon name="delete" style={styles.itemActionButton}
            onPress={() => deleteItem(info.item)}
        />
    }

    const RenderUpdateIcon = (info) => {
        return <Icon name="file-edit-outline" style={styles.itemActionButton}
            onPress={() => {
                setUpdating(info.index);
                setItemUpdating(info.item)
            }}
        />
    }

    const getFormattedTime = (time, index) => {
        const data = timers
        data[index].currentTime = time
    }

    const options = {
        container: {
            alignSelf: 'center'
        },
        text: {
            marginTop: 4,
            fontSize: 14,
            fontWeight: 'bold',
        }
    };

    const stopTimer = (index) => {
        const data = [...timers]
        data[index].action = false
        console.log(data[index].action)
        setTimers(data)
    }

    const startTimer = (index) => {
        const data = [...timers]
        data[index].action = true
        setTimers(data)
    }

    const update = (index) => {
        const data = [...timers]
        data[index].title = itemUpdating.title
        data[index].project = itemUpdating.project
        setTimers(data)
        setUpdating(-1)
    }

    const deleteItem = (item) => {
        var data = [...timers]
        const index = data.indexOf(item);
        if (index !== -1) {
            data = data.filter((el, ind) => {
                return ind !== index;
            });
            setTimers(data)
        }
    }

    const onAddNewItem = () => {
        const newItem = { title: '', project: '' }
        setTimers([...timers, newItem])
        setItemUpdating(newItem)
        setUpdating(timers.length)
    }

    const renderListHeaderComponent = () =>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Timers</Text>
        </View>



    const renderListFooterComponent = () =>
        <TouchableOpacity style={[styles.floatingButton, { marginHorizontal: 30, marginBottom: 20 }]}
            onPress={onAddNewItem}
        >
            <Text>
                {'Add'}
            </Text>
        </TouchableOpacity>


    const renderItem = (info) => {

        console.log(info)
        return (
            < View style={styles.itemContainer} >
                <View style={styles.itemHeader}>
                    {updating == info.index ?
                        <TextInput
                            style={styles.input}
                            onChangeText={(val) => setItemUpdating({ title: val, project: itemUpdating.project })}
                            value={itemUpdating.title}
                            placeholder="Title"
                        /> :
                        <Text
                            style={[
                                styles.itemTitle,
                                {
                                    color: isDarkMode ? Colors.white : Colors.black,
                                },
                            ]}>
                            {info.item.title}
                        </Text>}
                    {updating == info.index ?
                        <TextInput
                            style={styles.input}
                            onChangeText={(val) => setItemUpdating({ title: itemUpdating.title, project: val })}
                            value={itemUpdating.project}
                            placeholder="Project"
                        /> :
                        <Text
                            style={[
                                styles.itemDescription,
                                {
                                    color: isDarkMode ? Colors.light : Colors.dark,
                                },
                            ]}>
                            {info.item.project}
                        </Text>}
                </View>
                <Stopwatch laps start={info.item.action}
                    options={options}
                    getTime={(time) => getFormattedTime(time, info.index)} />

                <View
                    style={[
                        styles.itemActions,
                    ]}>
                    <RenderDeleteIcon {...info} />
                    <RenderUpdateIcon {...info} />
                </View>
                {
                    updating !== info.index ?
                        <TouchableOpacity style={[styles.floatingButton, { borderRightColor: info.item.action ? 'red' : 'green', borderBottomColor: info.item.action ? 'red' : 'green', }]}
                            onPress={() => info.item.action ? stopTimer(info.index) : startTimer(info.index)}
                        >
                            <Text style={{ color: info.item.action ? 'red' : 'green', }}>
                                {info.item.action ? 'Stop' : 'Start'}
                            </Text>
                        </TouchableOpacity>

                        :
                        <View style={styles.row}>
                            <TouchableOpacity style={[styles.floatingButton, { borderColor: 'blue', width: '50%' }]}
                                onPress={() => update(info.index)}
                            >
                                <Text style={{ color: 'blue', }}>
                                    {'Update'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.floatingButton, { borderColor: 'red', width: '50%' }]}
                                onPress={() => setUpdating(-1)}
                            >
                                <Text style={{ color: 'red', }}>
                                    {'Cancel'}
                                </Text>
                            </TouchableOpacity>

                        </View>
                }
            </View >

        )
    }

    return (
        <SafeAreaView style={backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <FlatList
                data={timers}
                renderItem={renderItem}
                keyExtractor={item => item.index}
                extraData={timers}
                style={{ height: '100%' }}
                ListFooterComponent={renderListFooterComponent}
                ListHeaderComponent={renderListHeaderComponent}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        margin: 30,
        backgroundColor: 'white',
        height: 200,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    itemHeader: {
        padding: 10
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    itemDescription: {
        marginTop: 4,
        fontSize: 12,
        fontWeight: '400',
    },
    itemActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 10,
    },
    itemActionButton: {
        paddingLeft: 10,
        fontSize: 14
    },
    header: {
        alignItems: 'center',
        padding: 10,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    floatingButton: {
        borderWidth: 1,
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    input: {
        borderWidth: 0.5,
        padding: 4
    }
});

export default App;
