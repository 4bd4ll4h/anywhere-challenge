import { Announcement } from '../models/Announcement';
import { Quiz } from '../models/Quiz';
import { IUser, User } from '../models/User';

export const seedData = async (): Promise<void> => {
  try {
    // Clear existing data
    await Announcement.deleteMany({});
    await Quiz.deleteMany({});
    await User.deleteMany({});

    // Create default user
    const user = await User.create({
      name: 'Talia',
      email: 'student@anyware.com',
      avatar: 'https://picsum.photos/150',
      role: 'student'
    }) as IUser;

    // Create sample announcements
    const announcements = await Announcement.create([
      {
        title: 'Hi my heroes! I just want you ready for exams...',
        content: 'Hi my heroes! I just want you ready for exams. Make sure to review all the materials we covered this semester. Good luck everyone!',
        author: {
          name: 'Mr. Ahmed Mostafa',
          avatar: 'https://picsum.photos/150',
          role: 'teacher'
        },
        subject: 'Math 101',
        course: 'Mathematics',
        type: 'academic',
        priority: 'high',
        createdBy: user.id
      },
      {
        title: 'Hello my students, I want to announce that...',
        content: 'Hello my students, I want to announce that the final exam schedule has been updated. Please check your emails for the new schedule.',
        author: {
          name: 'Mrs. Salma Ahmed',
          avatar: 'https://picsum.photos/150',
          role: 'teacher'
        },
        subject: 'Physics 02',
        course: 'Physics',
        type: 'academic',
        priority: 'medium',
        createdBy: user.id
      },
      {
        title: 'Goooooooooood morning, Warriors!',
        content: 'Goooooooooood morning, Warriors! We have some exciting news about the upcoming semester. Stay tuned for more updates.',
        author: {
          name: 'School management',
          avatar: 'https://picsum.photos/150',
          role: 'management'
        },
        type: 'general',
        priority: 'low',
        createdBy: user.id
      },
      {
        title: 'Hellooo, Can\'t wait for our upcoming trip...',
        content: 'Hellooo, Can\'t wait for our upcoming trip to the science museum. It\'s going to be an amazing experience for everyone!',
        author: {
          name: 'Events Manager',
          avatar: 'https://picsum.photos/150',
          role: 'admin'
        },
        type: 'general',
        priority: 'medium',
        createdBy: user.id
      }
    ]);

    // Create sample quizzes
    const quizzes = await Quiz.create([
      {
        title: 'Unit 2 quiz',
        description: 'Quiz covering Unit 2 material on motion and forces',
        course: 'Physics 02',
        subject: 'Physics',
        topic: 'Unit 2. Motion and forces',
        type: 'quiz',
        dueDate: new Date('2025-12-20T21:00:00Z'),
        duration: 60,
        totalPoints: 100,
        isActive: true,
        instructions: 'Complete all questions within the time limit. Show your work for full credit.',
        questions: [
          {
            question: 'What is the SI unit of force?',
            options: ['Newton', 'Joule', 'Watt', 'Pascal'],
            correctAnswer: 0
          },
          {
            question: 'Which of the following is a vector quantity?',
            options: ['Mass', 'Temperature', 'Velocity', 'Time'],
            correctAnswer: 2
          }
        ]
      },
      {
        title: '12-12 Assignment',
        description: 'Arabic text assignment for B12 level',
        course: 'Arabic B12',
        subject: 'Arabic',
        topic: 'Arabic text shown in Arabic font',
        type: 'assignment',
        dueDate: new Date('2025-12-20T21:00:00Z'),
        totalPoints: 50,
        isActive: true,
        instructions: 'Complete the Arabic text assignment. Make sure to use proper Arabic font and grammar.',
        questions: [
          {
            question: 'Write a paragraph about your daily routine in Arabic',
            options: ['Assignment question - no multiple choice'],
            correctAnswer: 0
          }
        ]
      },
      {
        title: 'Final Exam - Mathematics',
        description: 'Comprehensive final exam covering all topics',
        course: 'Math 101',
        subject: 'Mathematics',
        topic: 'Comprehensive Review',
        type: 'quiz',
        dueDate: new Date('2025-12-25T14:00:00Z'),
        duration: 120,
        totalPoints: 200,
        isActive: true,
        instructions: 'This is a comprehensive final exam. You have 2 hours to complete all sections.',
        questions: [
          {
            question: 'What is the derivative of x²?',
            options: ['x', '2x', 'x²', '2x²'],
            correctAnswer: 1
          },
          {
            question: 'What is the integral of 2x?',
            options: ['x²', 'x² + C', '2x²', '2x² + C'],
            correctAnswer: 1
          },
          {
            question: 'What is the value of π (pi)?',
            options: ['3.14', '3.14159', '22/7', 'All of the above'],
            correctAnswer: 3
          }
        ]
      }
    ]);

    console.log('✅ Seed data created successfully');
    console.log(`📊 Created ${announcements.length} announcements`);
    console.log(`📝 Created ${quizzes.length} quizzes`);
    console.log(`👤 Created 1 user`);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}; 