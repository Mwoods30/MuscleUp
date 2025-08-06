import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import styled from 'styled-components';

const SkeletonWrapper = styled.div`
  .react-loading-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @media (prefers-color-scheme: dark) {
    .react-loading-skeleton {
      background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
    }
  }
`;

// Workout Card Skeleton
export const WorkoutCardSkeleton = () => (
  <SkeletonWrapper>
    <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
      <div style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px', marginBottom: '1rem' }}>
        <Skeleton height={24} width="70%" style={{ marginBottom: '0.5rem' }} />
        <Skeleton height={16} width="50%" style={{ marginBottom: '0.5rem' }} />
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Skeleton height={36} width={80} />
          <Skeleton height={36} width={80} />
          <Skeleton height={36} width={80} />
        </div>
      </div>
    </SkeletonTheme>
  </SkeletonWrapper>
);

// Meal Card Skeleton
export const MealCardSkeleton = () => (
  <SkeletonWrapper>
    <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
      <div style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px', marginBottom: '1rem' }}>
        <Skeleton height={20} width="60%" style={{ marginBottom: '0.5rem' }} />
        <Skeleton height={14} width="40%" style={{ marginBottom: '1rem' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton height={32} width={60} />
          <Skeleton height={32} width={60} />
          <Skeleton height={32} width={60} />
        </div>
      </div>
    </SkeletonTheme>
  </SkeletonWrapper>
);

// Dashboard Stats Skeleton
export const DashboardStatsSkeleton = () => (
  <SkeletonWrapper>
    <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ padding: '1.5rem', border: '1px solid #eee', borderRadius: '12px' }}>
            <Skeleton height={40} width={40} circle style={{ marginBottom: '1rem' }} />
            <Skeleton height={28} width="80%" style={{ marginBottom: '0.5rem' }} />
            <Skeleton height={16} width="60%" />
          </div>
        ))}
      </div>
    </SkeletonTheme>
  </SkeletonWrapper>
);

// Profile Form Skeleton
export const ProfileFormSkeleton = () => (
  <SkeletonWrapper>
    <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Skeleton height={100} width={100} circle style={{ margin: '0 auto 2rem', display: 'block' }} />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ marginBottom: '1.5rem' }}>
            <Skeleton height={16} width="30%" style={{ marginBottom: '0.5rem' }} />
            <Skeleton height={44} width="100%" />
          </div>
        ))}
        <Skeleton height={48} width={120} style={{ marginTop: '2rem' }} />
      </div>
    </SkeletonTheme>
  </SkeletonWrapper>
);

// List Item Skeleton
export const ListItemSkeleton = ({ count = 5 }) => (
  <SkeletonWrapper>
    <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eee' }}>
          <Skeleton height={48} width={48} circle style={{ marginRight: '1rem' }} />
          <div style={{ flex: 1 }}>
            <Skeleton height={18} width="70%" style={{ marginBottom: '0.5rem' }} />
            <Skeleton height={14} width="50%" />
          </div>
          <Skeleton height={32} width={80} />
        </div>
      ))}
    </SkeletonTheme>
  </SkeletonWrapper>
);

// Generic Content Skeleton
export const ContentSkeleton = ({ lines = 3, width = "100%" }) => (
  <SkeletonWrapper>
    <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          height={16} 
          width={i === lines - 1 ? "70%" : width} 
          style={{ marginBottom: '0.75rem' }} 
        />
      ))}
    </SkeletonTheme>
  </SkeletonWrapper>
);
