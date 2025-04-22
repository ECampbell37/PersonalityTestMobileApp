/************************************************************
 * Name:    Elijah Campbell‑Ihim
 * Project: Personality Test Mobile App (Final Project)
 * Class:   CMPS-285 Mobile Development
 * Date:    April 2025
 * File:    /screens/TestScreen.tsx
 ************************************************************/

// React and React Native imports
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView
} from 'react-native';

// Import local test questions data
import { questions } from '../src/questions';

// Constant for separating questions into pages
const QUESTIONS_PER_PAGE = 10;


/**
 * TestScreen Component
 *
 * Props:
 * - route: navigation route (includes page number and previous answers)
 * - navigation: allows moving to next/previous test screens or results
 *
 * State:
 * - pageAnswers: stores answers for the current set of 10 questions
 *
 * Features:
 * - Separates the test questions into pages(10 per page)
 * - Allows rating selection for each question (1 to 5)
 * - Navigation to next or previous test screen
 * - Ensures all questions are answered before proceeding
 */
const TestScreen = ({ route, navigation }: any) => {
  const { page, answers } = route.params;

  // Local answers for current page
  const [pageAnswers, setPageAnswers] = useState<number[]>(Array(QUESTIONS_PER_PAGE).fill(null));

  // Ref to allow scrolling back to top when changing pages
  const scrollRef = useRef<ScrollView>(null);

  // Calculate question slice for current page
  const startIndex = (page - 1) * QUESTIONS_PER_PAGE;
  const currentQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

   /**
   * On mount or page change:
   * - Load previously saved answers for this page if any
   * - Scroll to top with animation
   */
  useEffect(() => {
    const existing = answers.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    setPageAnswers(existing.length ? existing : Array(QUESTIONS_PER_PAGE).fill(null));

    // Smooth scroll to top after page has rendered
    const timeout = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ y: 0, animated: true });
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [answers, startIndex]);


   /**
   * Update answer for a specific question when the user clicks on it
   */
  const handleSelect = (index: number, rating: number) => {
    const newAnswers = [...pageAnswers];
    newAnswers[index] = rating;
    setPageAnswers(newAnswers);
  };

  /**
  * Validate answers and proceed to the next page or results screen
  */
  const handleNext = () => {
    if (pageAnswers.some(answer => answer === null)) {
      Alert.alert('Incomplete', 'Please answer all questions before proceeding.');
      return;
    }

    const updatedAnswers = [...answers];
    for (let i = 0; i < QUESTIONS_PER_PAGE; i++) {
      updatedAnswers[startIndex + i] = pageAnswers[i];
    }

    if (page < Math.ceil(questions.length / QUESTIONS_PER_PAGE)) {
      navigation.navigate('Test', { page: page + 1, answers: updatedAnswers });
    } else {
      navigation.navigate('Results', { answers: updatedAnswers });
    }
  };


  /**
  * Go back to the previous page (if not on the first)
  */
  const handlePrevious = () => {
    const updatedAnswers = [...answers];
    for (let i = 0; i < QUESTIONS_PER_PAGE; i++) {
      updatedAnswers[startIndex + i] = pageAnswers[i];
    }

    if (page > 1) {
      navigation.navigate('Test', { page: page - 1, answers: updatedAnswers });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[1]}
      >

        {/* Instructions text */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Rank each statement on how well it describes you. Use a scale from 1 (strongly disagree) to 5 (strongly agree). Each statement reads as follows: "I ..."
          </Text>
        </View>

        {/* Answer Scale Labels */}
        <View style={styles.labelContainer}>
          <View style={styles.labelLine}>
            <Text style={styles.labelLeft}>Strongly Disagree</Text>
            <Text style={styles.labelRight}>Strongly Agree</Text>
          </View>
        </View>

        {/* Render each question with rating buttons */}
        {currentQuestions.map((item, index) => (
          <View key={item.id} style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {item.id}. {item.text}
            </Text>
            <View style={styles.options}>
              {[1, 2, 3, 4, 5].map(rating => (
                <TouchableOpacity
                  key={rating}
                  style={[
                    styles.optionButton,
                    pageAnswers[index] === rating && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(index, rating)}
                >
                  <Text style={styles.optionText}>{rating}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handlePrevious} disabled={page === 1} style={styles.footerButton}>
          <Text style={[styles.footerText, page === 1 && styles.disabledText]}>Previous</Text>
        </TouchableOpacity>
        <View style={styles.pageNumberContainer}>
          <Text style={styles.pageNumber}>Page {page}</Text>
        </View>
        <TouchableOpacity onPress={handleNext} style={styles.footerButton}>
          <Text style={styles.footerText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  descriptionContainer: {
    paddingVertical: 20,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  labelContainer: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 15,
    zIndex: 1,
  },
  labelLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  labelLeft: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  labelRight: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    textAlign: 'right',
  },
  questionContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  optionButton: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedOption: {
    backgroundColor: '#66B2FF',
    borderColor: '#66B2FF',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  footerText: {
    fontSize: 18,
    color: '#007AFF',
  },
  disabledText: {
    color: '#aaa',
  },
  pageNumber: {
    fontSize: 18,
    color: '#000',
  },
  pageNumberContainer: {
    flex: 1,
    alignItems: 'center',
  },
  footerButton: {
    minWidth: 80,
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
  },
});

export default TestScreen;
