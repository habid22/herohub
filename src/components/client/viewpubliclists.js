import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/auth';
import axios from 'axios';
import { Flex, Text, Button } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';





// View Public Lists Component
export default function ViewPublicLists() {
    const [lists, setLists] = useState([]);
    const [selectedList, setSelectedList] = useState(null);
    const [listDetails, setListDetails] = useState({});
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [isCommentModalOpen, setCommentModalOpen] = useState(false);
    const [commentInput, setCommentInput] = useState('');
    const [isCommentsModalOpen, setCommentsModalOpen] = useState(false);
    const [fetchedComments, setFetchedComments] = useState([]);
    const { user } = useAuth();
    const isAdminUser = user?.email === "hassanaminsheikh@gmail.com";
  
    const fetchDateModified = (listName) => {
      axios
        .get(`/api/lists/${listName}/date_modified`)
        .then((dateModifiedResponse) => {
          setListDetails((prevDetails) => ({
            ...prevDetails,
            [listName]: {
              ...prevDetails[listName],
              date_modified: dateModifiedResponse.data.date_modified,
            },
          }));
        })
        .catch((error) => {
          console.error('Error fetching date_modified:', error);
        });
    };
  
    const fetchCreatedBy = (listName) => {
      axios
        .get(`/api/lists/${listName}/created_by`)
        .then((createdByResponse) => {
          setListDetails((prevDetails) => ({
            ...prevDetails,
            [listName]: {
              ...prevDetails[listName],
              created_by: createdByResponse.data.created_by,
            },
          }));
        })
        .catch((error) => {
          console.error('Error fetching created_by:', error);
        });
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('/api/lists');
          const visibleLists = [];
  
          for (const listName of response.data) {
            const visibilityResponse = await axios.get(`/api/lists/${listName}/visibility`);
            if (visibilityResponse.data.isVisible) {
              visibleLists.push(listName);
            }
          }
  
          setLists(visibleLists);
  
          const detailRequests = visibleLists.map((listName) =>
            axios.get(`/api/lists/${listName}`)
          );
  
          const detailResponses = await Promise.all(detailRequests);
  
          const detailsMap = {};
          detailResponses.forEach((response, index) => {
            detailsMap[response.data.listName] = response.data;
          });
  
          setListDetails(detailsMap);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    useEffect(() => {
      lists.forEach((listName) => {
        fetchDateModified(listName);
      });
    }, [lists]);
  
    useEffect(() => {
      lists.forEach((listName) => {
        fetchCreatedBy(listName);
      });
    }, [lists]);
  
    const sortedLists = [...lists].sort(
      (a, b) => new Date(listDetails[b]?.date_modified) - new Date(listDetails[a]?.date_modified)
    );
  
    const handleViewMore = (listName) => {
      setDetailsLoading(true);
  
      if (selectedList === listName) {
        setSelectedList(null);
        setDetailsLoading(false);
      } else {
        setSelectedList(listName);
  
        axios
          .get(`/api/lists/${listName}`)
          .then((response) => {
            setListDetails((prevDetails) => ({
              ...prevDetails,
              [listName]: response.data,
            }));
  
            axios
              .get(`/api/lists/${listName}/heroes`)
              .then((heroesResponse) => {
                setListDetails((prevDetails) => ({
                  ...prevDetails,
                  [listName]: {
                    ...prevDetails[listName],
                    heroes: heroesResponse.data,
                  },
                }));
              })
              .catch((error) => {
                console.error('Error fetching list heroes:', error);
              })
              .finally(() => {
                setDetailsLoading(false);
              });
          })
          .catch((error) => {
            console.error('Error fetching list details:', error);
            setDetailsLoading(false);
          });
      }
    };
  
    const handleHideDetails = () => {
      setSelectedList(null);
    };
  
    const handleAddComment = () => {
      if (!selectedList) {
        console.error('No selected list to add comment to');
        return;
      }
  
      axios
        .put(`/api/lists/${selectedList}/comments`, {
          comment: `${user.username} commented: ${commentInput}`,
        })
        .then((response) => {
          console.log(response.data);
          setCommentModalOpen(false);
        })
        .catch((error) => {
          console.error('Error adding comment:', error);
        });
    };
  
    const handleCommentModalToggle = () => {
      setCommentModalOpen(!isCommentModalOpen);
    };
  
    const handleViewCommentsToggle = () => {
      if (!selectedList) {
        console.error('No selected list to view comments');
        return;
      }
  
      axios
        .get(`/api/lists/${selectedList}/comments`)
        .then((response) => {
          setFetchedComments(response.data.comments);
          setCommentsModalOpen(true);
        })
        .catch((error) => {
          console.error('Error fetching comments:', error);
        });
    };
  
    const handleDeleteComment = (index) => {
      if (!selectedList) {
        console.error('No selected list to update comment visibility');
        return;
      }
  
      axios
        .put(`/api/lists/${selectedList}/comments/${index}/visibility`, { visibility: false })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error updating comment visibility:', error);
        });
    };
  
    const handleShowComment = (index) => {
      if (!selectedList) {
        console.error('No selected list to update comment visibility');
        return;
      }
  
      axios
        .put(`/api/lists/${selectedList}/comments/${index}/visibility/true`)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error updating comment visibility:', error);
        });
    };
  
    return (
      <Flex flexDirection="column" width="100%" mb={4}>
        {sortedLists.map((listName) => (
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
            {selectedList === listName && (
              <>
                <Button size="sm" onClick={handleCommentModalToggle} mt={2}>
                  Add Comment
                </Button>
  
                <Button size="sm" onClick={handleViewCommentsToggle} mt={2}>
                  View Comments
                </Button>
              </>
            )}
  
            {selectedList === listName && listDetails[listName] && !detailsLoading && (
              <Flex flexDirection="column" mt={2}>
                <Text fontWeight="bold" mt={2} textAlign="center" fontSize="lg">
                  List Details
                </Text>
                <Text>
                  <span style={{ fontWeight: 'bold' }}>Description:</span>{' '}
                  {listDetails[listName].description}
                </Text>
                <hr style={{ borderTop: '1px solid #ddd', margin: '10px 0' }} />
                {listDetails[listName].heroes &&
                  listDetails[listName].heroes.map((hero) => (
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
                <Modal isOpen={isCommentModalOpen} onClose={handleCommentModalToggle} size="xl">
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Add Comment</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <textarea
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder=" Type your comment here"
                        style={{ width: '100%', height: '100px' }}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button colorScheme="teal" mr={3} onClick={handleAddComment}>
                        Add Comment
                      </Button>
                      <Button colorScheme="red" onClick={handleCommentModalToggle}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                <Modal isOpen={isCommentsModalOpen} onClose={() => setCommentsModalOpen(false)} size="full">
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>View Comments</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      {Array.isArray(fetchedComments) && fetchedComments.length > 0 ? (
                        fetchedComments
                          .filter((comment) => (isAdminUser || comment.visibility) ? comment : null)
                          .map((comment, index) => (
                            <div
                              key={index}
                              style={{
                                borderBottom: '1px solid #f5f5f5',
                                padding: '10px 0',
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              <div>{comment.text}</div>
                              {isAdminUser && (
                                <div>
                                  <Button
                                    colorScheme="red"
                                    onClick={() => handleDeleteComment(index, false)}
                                    mr={2}
                                  >
                                    Hide
                                  </Button>
                                  <Button
                                    colorScheme="green"
                                    onClick={() => handleShowComment(index)}
                                  >
                                    Show
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))
                      ) : (
                        <div>No comments available</div>
                      )}
                    </ModalBody>
                    <ModalFooter>
                      <Button colorScheme="teal" onClick={() => setCommentsModalOpen(false)}>
                        Close
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Flex>
            )}
          </Flex>
        ))}
      </Flex>
    );
  }