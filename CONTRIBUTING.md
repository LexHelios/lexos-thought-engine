# Contributing to LexOS

Thank you for your interest in contributing to LexOS! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git
- Basic knowledge of React, TypeScript, and Supabase

### Development Setup

1. **Fork and clone the repository**
```bash
git clone https://github.com/yourusername/lexos.git
cd lexos
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your development Supabase credentials
```

4. **Start the development server**
```bash
npm run dev
```

## 🔧 Development Workflow

### Branch Naming Convention
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring
- `test/description` - Test additions/improvements

### Commit Message Format
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer(s)]
```

Examples:
- `feat(auth): add password reset functionality`
- `fix(ui): resolve modal overlay z-index issue`
- `docs(readme): update installation instructions`
- `test(auth): add unit tests for sign-up flow`

### Pull Request Process

1. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
```bash
npm run test
npm run lint
npm run type-check
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat(component): add new feature"
```

5. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

6. **Create a Pull Request**
   - Use a descriptive title
   - Fill out the PR template
   - Link any related issues
   - Request review from maintainers

## 📝 Code Standards

### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid `any` types when possible
- Use meaningful variable and function names

### React
- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices
- Use proper key props for lists

### Styling
- Use Tailwind CSS utility classes
- Follow the design system tokens
- Ensure responsive design
- Test in both light and dark modes

### Testing
- Write unit tests for utilities and hooks
- Add integration tests for components
- Include E2E tests for critical user flows
- Maintain test coverage above 80%

## 🏗️ Architecture Guidelines

### Component Structure
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── auth/         # Authentication components
│   └── ...           # Feature-specific components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── pages/            # Route components
└── integrations/     # External service integrations
```

### File Naming
- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts`
- Utilities: `camelCase.ts`
- Constants: `UPPER_SNAKE_CASE.ts`

### Import Order
1. React imports
2. Third-party library imports
3. Internal imports (components, hooks, utils)
4. Relative imports
5. Type-only imports

## 🧪 Testing Guidelines

### Unit Tests
- Test component rendering and behavior
- Test utility functions with edge cases
- Mock external dependencies
- Use descriptive test names

### Integration Tests
- Test component interactions
- Test API integrations
- Test authentication flows
- Test error scenarios

### E2E Tests
- Test critical user journeys
- Test cross-browser compatibility
- Test responsive design
- Test accessibility features

## 🔒 Security Guidelines

### Authentication
- Never store sensitive data in localStorage
- Use secure session management
- Implement proper error handling
- Follow OWASP security guidelines

### Database
- Use Row Level Security (RLS) policies
- Validate all inputs
- Use parameterized queries
- Implement proper authorization

### API Security
- Validate all API inputs
- Use HTTPS for all communications
- Implement rate limiting
- Log security events

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for complex functions
- Document component props with TypeScript
- Include usage examples for utilities
- Keep comments up-to-date

### README Updates
- Update feature lists when adding functionality
- Keep installation instructions current
- Add new environment variables
- Update deployment instructions

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description** - Clear description of the issue
2. **Steps to Reproduce** - Detailed steps to reproduce the bug
3. **Expected Behavior** - What should happen
4. **Actual Behavior** - What actually happens
5. **Environment** - OS, browser, Node.js version
6. **Screenshots** - If applicable
7. **Console Logs** - Any relevant error messages

## 💡 Feature Requests

When requesting features, please include:

1. **Problem Statement** - What problem does this solve?
2. **Proposed Solution** - How should it work?
3. **Alternatives** - Other solutions considered
4. **Use Cases** - When would this be used?
5. **Priority** - How important is this feature?

## 🎯 Performance Guidelines

### Optimization
- Use React.memo for expensive components
- Implement proper code splitting
- Optimize images and assets
- Minimize bundle size

### Monitoring
- Add performance metrics
- Monitor Core Web Vitals
- Track user interactions
- Monitor error rates

## 🌐 Accessibility

### Requirements
- Meet WCAG 2.1 AA standards
- Support keyboard navigation
- Provide proper ARIA labels
- Ensure color contrast compliance
- Test with screen readers

## 📱 Mobile Support

### Guidelines
- Design mobile-first
- Test on various devices
- Optimize touch interactions
- Consider offline functionality

## 🚀 Deployment

### Production Checklist
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Security scan passes
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Environment variables configured

## 👥 Community

### Getting Help
- Join our [Discord server](https://discord.gg/lexos)
- Check existing [GitHub Issues](https://github.com/yourusername/lexos/issues)
- Read the [documentation](https://docs.lexos.ai)

### Code of Conduct
We follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Please be respectful and inclusive in all interactions.

## 📄 License

By contributing to LexOS, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to LexOS! 🎉