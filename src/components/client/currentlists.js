import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/auth';
import axios from 'axios';
import { Flex, Text, Button } from '@chakra-ui/react';


// View all lists created by the logged in user
export default function MyCurrentLists() {
    const { user } = useAuth();
    const [userLists, setUserLists] = useState([]);
    const [selectedList, setSelectedList] = useState(null);
    const [listDetails, setListDetails] = useState({});
    const [detailsLoading, setDetailsLoading] = useState(false);

  
    const fetchDateModified = (listName) => {
      fetch(`/api/lists/${listName}/date_modified`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((dateModifiedResponse) => {
          setListDetails((prevDetails) => ({
            ...prevDetails,
            [listName]: {
              ...prevDetails[listName],
              date_modified: dateModifiedResponse.date_modified,
            },
          }));
        })
        .catch((error) => {
          console.error('Error fetching date_modified:', error);
        });
    };
  
    const fetchCreatedBy = (listName) => {
      fetch(`/api/lists/${listName}/created_by`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((createdByResponse) => {
          setListDetails((prevDetails) => ({
            ...prevDetails,
            [listName]: {
              ...prevDetails[listName],
              created_by: createdByResponse.created_by,
            },
          }));
        })
        .catch((error) => {
          console.error('Error fetching created_by:', error);
        });
    };
    
  
    const fetchHeroes = (listName) => {
      fetch(`/api/lists/${listName}/heroes`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((heroesData) => {
          setListDetails((prevDetails) => ({
            ...prevDetails,
            [listName]: {
              ...prevDetails[listName],
              heroes: heroesData,
            },
          }));
        })
        .catch((error) => {
          console.error('Error fetching list heroes:', error);
        });
    };
  
    const handleMakePrivate = async (listName) => {
      try {
        await fetch(`/api/lists/${listName}/visibilityFalse`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isVisible: false }),
        });
    
        setUserLists((prevUserLists) =>
          prevUserLists.map((name) => (name === listName ? `${name} (Private)` : name))
        );
      } catch (error) {
        console.error(`Error making list ${listName} private:`, error);
      }
      return null;
    };
  
    const handleMakePublic = async (listName) => {
      try {
        await fetch(`/api/lists/${listName}/visibilityTrue`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isVisible: true }),
        });
  
        setUserLists((prevUserLists) =>
          prevUserLists.map((name) => (name === listName ? name.replace(' (Private)', '') : name))
        );
      } catch (error) {
        console.error(`Error making list ${listName} public:`, error);
      }
      return null;
    };
  
    useEffect(() => {
      const fetchUserLists = async () => {
        try {
          const response = await fetch(`/api/lists/created_by/${user.username}`);
          const data = await response.json();
          setUserLists(data);
        } catch (error) {
          console.error("Error fetching user lists:", error);
        }
      };
  
      if (user) {
        fetchUserLists();
      }
    }, [user]);
  
    useEffect(() => {
      userLists.forEach((listName) => {
        fetchDateModified(listName);
      });
  
      userLists.forEach((listName) => {
        fetchCreatedBy(listName);
      });
    }, [userLists]);
  
    const handleViewMore = (listName) => {
      setDetailsLoading(true);

  if (selectedList === listName) {
    setSelectedList(null);
    setDetailsLoading(false);
  } else {
    setSelectedList(listName);

    fetch(`/api/lists/${listName}`)
      .then((response) => response.json())
      .then((data) => {
        setListDetails((prevDetails) => ({
          ...prevDetails,
          [listName]: data,
        }));
      })
      .catch((error) => {
        console.error('Error fetching list details:', error);
      })
      .finally(() => {
        setDetailsLoading(false);
      });

    fetchHeroes(listName);
  }

  };

  const handleHideDetails = () => {
    setSelectedList(null);
  };

  const handleDeleteList = async (listName) => {
    try {
      await fetch(`/api/lists/${listName}`, {
        method: 'DELETE',
      });
      setUserLists((prevUserLists) => prevUserLists.filter((name) => name !== listName));
    } catch (error) {
      console.error(`Error deleting list ${listName}:`, error);
    }
  };
  
    return (
      <Flex flexDirection="column" width="100%" mb={4}>
        {userLists.map((listName) => (
          <Flex key={listName} flexDirection="column" mt={4}>
            <Text fontWeight="bold" fontSize="xl">
              List Name: {listName}
            </Text>
            <Text>
              Created by: {listDetails[listName]?.created_by || 'Not available'}
            </Text>
            <Text>
              Date Modified: {listDetails[listName]?.date_modified || 'Not available'}
            </Text>
            <Button size="sm" onClick={() => handleViewMore(listName)} mt={2}>
              {selectedList === listName ? 'Hide Details' : 'View Details'}
            </Button>
  
            <Button size="sm" onClick={() => handleMakePrivate(listName)} mt={2}>
              Make Private
            </Button>
  
            <Button size="sm" onClick={() => handleMakePublic(listName)} mt={2}>
              Make Public
            </Button>
  
            <Button size="sm" onClick={() => handleDeleteList(listName)} mt={2}>
              Delete
            </Button>
  
            {selectedList === listName && listDetails[listName] && !detailsLoading && (
              <Flex flexDirection="column" mt={2}>
                <Text fontWeight="bold" mt={2} textAlign="center" fontSize="lg">
                  List Details
                </Text>
                <Text>
                  <span style={{ fontWeight: 'bold' }}>Description:</span>{' '}
                  {listDetails[listName].description}
                </Text>
                {listDetails[listName].heroes && (
                  <>
                    {listDetails[listName].heroes.map((hero) => (
                      <Flex key={hero.info.id} flexDirection="column" mt={2}>
                        <Text>
                          <span style={{ fontWeight: 'bold' }}>Name:</span> {hero.info.name}
                        </Text>
                        <Text>
                          <span style={{ fontWeight: 'bold' }}>Publisher:</span>{' '}
                          {hero.info.Publisher}
                        </Text>
                        <Text>
                          <span style={{ fontWeight: 'bold' }}>Powers:</span>{' '}
                          {hero.info.powers.join(', ')}
                        </Text>
                        <hr style={{ borderTop: '1px solid #ddd', margin: '10px 0' }} />
                      </Flex>
                    ))}
                  </>
                )}
              </Flex>
            )}
          </Flex>
        ))}
      </Flex>
    );
  }