import { useEffect, useState } from "react";
import { View, FlatList, Alert } from "react-native";
import PostListItem from "~/src/components/PostListItem";
import { supabase } from "~/src/lib/supabase";

export default function Feed() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {      
        let { data, error } = await supabase
        .from('posts')
        .select('*, user:profiles(*)');

        if (error) 
            Alert.alert("Something went wrong!");

        setPosts(data);
    }

    return (
        <FlatList 
            data={posts} 
            contentContainerStyle={{ gap: 10, maxWidth: 512, width: "100%", alignSelf: "center" }}
            renderItem={({ item }) => <PostListItem post={item} /> }
            showsVerticalScrollIndicator={false}
        />
    );
}