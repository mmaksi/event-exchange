import { useState, useEffect } from 'react';
import axios from 'axios';

interface IUser {
  id: string;
}

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/api/users/current-user');
        if (data.currentUser?.id) setCurrentUser(data.currentUser);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  return currentUser;
};

export default useCurrentUser;
