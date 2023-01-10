import React, { useState, useEffect } from 'react'
import { useChatContext } from 'stream-chat-react'
import { SearchIcon } from '../assets'
import { ResultsDropDown } from './'
const ChannelSearch = ({ setToggleContainer }) => {
    const { client, setActiveChannel } = useChatContext()
    const [teamChannels, setTeamChannels] = useState([])
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [directChannels, setDirectChannels] = useState([])
    useEffect(() => {
        if (!query) {
            setTeamChannels([]);

            setDirectChannels([]);
        }
    }, [query])
    const getChannels = async (text) => {
        try {
            const channelResponse = client.queryChannels({
                type: 'team',
                name: { $autocomplete: text },
                members: { $in: [client.userID] }
            });
            const userResponse = client.queryUsers({
                id: { $ne: client.userID },
                name: { $autocomplete: text }
            })
            
            const [channels, { users }] = await Promise.all([channelResponse, userResponse]);
            if (channels.length) setTeamChannels(channels);
            if (users.length) setDirectChannels(users);

        }
        catch (error) {
            setQuery('')
        }
    }
    const onSearch = (event) => {
        event.preventDefault()
        setLoading(true)
        setQuery(event.target.value)
        getChannels(event.target.value)
    }
    const setChannel = (channel) => {
        setQuery('');
        setActiveChannel(channel)
    }
    console.log(directChannels)


    return (
        <div className="channel-search__container">
            <div className="channel-search__input__wrapper">
                <div className='channel-search__input__icon'>
                    <SearchIcon />
                </div>
                <input type="text"
                    className='channel-search__input__text'
                    placeholder="Search"
                    value={query}
                    onChange={onSearch} />

            </div>
            {query &&
                (
                    <ResultsDropDown
                        teamChannels={teamChannels}
                        directChannels={directChannels}
                        loading={loading}
                        setChannel={setChannel}
                        setQuery={setQuery}
                        setToggleContainer={setToggleContainer}
                    />
                )}
        </div>
    )
}

export default ChannelSearch